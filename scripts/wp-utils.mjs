import fs from "node:fs";
import path from "node:path";

const REQUIRED_ENV = ["WP_BASE_URL", "WP_API_USER", "WP_APP_PASSWORD"];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const vars = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    vars[key] = value;
  }

  return vars;
}

export function loadProjectEnv() {
  const root = process.cwd();
  const envOrder = [".env.local", ".env"];

  for (const file of envOrder) {
    const envPath = path.join(root, file);
    const parsed = parseEnvFile(envPath);
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

export function getWpConfig() {
  loadProjectEnv();

  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  return {
    baseUrl: process.env.WP_BASE_URL.replace(/\/+$/, ""),
    username: process.env.WP_API_USER,
    appPassword: process.env.WP_APP_PASSWORD,
  };
}

export function wpAuthHeader(username, appPassword) {
  const token = Buffer.from(`${username}:${appPassword}`, "utf8").toString(
    "base64"
  );
  return `Basic ${token}`;
}

export async function fetchWpJson(url, authHeader, options = {}) {
  const { timeoutMs = 30000 } = options;
  const headers = {
    Accept: "application/json",
  };

  if (authHeader) headers.Authorization = authHeader;

  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(timeoutMs),
  });

  const text = await response.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // Keep null when response body is not JSON.
  }

  if (!response.ok) {
    const details = json?.message || text || response.statusText;
    throw new Error(`WP request failed ${response.status}: ${details}`);
  }

  return { response, json };
}
