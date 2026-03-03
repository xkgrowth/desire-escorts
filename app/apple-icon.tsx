import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          backgroundColor: "#1A1B17",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/svg+xml,${encodeURIComponent(`
            <svg width="110" height="97" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gr" x1="25" y1="0" x2="17" y2="32.5" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F0D074"/>
                  <stop offset="0.57" stop-color="#F2DE9B"/>
                </linearGradient>
                <linearGradient id="gl" x1="6.03" y1="0.672" x2="16.47" y2="30.224" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F0D074"/>
                  <stop offset="0.567" stop-color="#F2DE9B"/>
                </linearGradient>
                <linearGradient id="bevel" x1="0" y1="0" x2="34" y2="30" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.75"/>
                  <stop offset="35%" stop-color="#F2DE9B" stop-opacity="0.45"/>
                  <stop offset="100%" stop-color="#C8A83A" stop-opacity="0.05"/>
                </linearGradient>
              </defs>
              <path d="M30.5057 2.76774C26.8157 -0.92258 20.8327 -0.92258 17.1427 2.76774L16.6367 3.27311V30L30.5057 16.1316C34.1957 12.4409 34.1957 6.45806 30.5057 2.76774Z" fill="url(#gr)"/>
              <path d="M2.73975 2.74782C6.39275 -0.91594 12.3158 -0.91594 15.9698 2.74782L16.4698 3.24956C18.9938 11.6481 18.7608 20.5341 16.4698 29.7841L2.73975 16.0151C-0.91325 12.3513 -0.91325 6.41159 2.73975 2.74782Z" fill="url(#gl)"/>
              <path d="M30.5057 2.76774C26.8157 -0.92258 20.8327 -0.92258 17.1427 2.76774L16.6367 3.27311V30L30.5057 16.1316C34.1957 12.4409 34.1957 6.45806 30.5057 2.76774Z" fill="none" stroke="url(#bevel)" stroke-width="0.7"/>
              <path d="M2.73975 2.74782C6.39275 -0.91594 12.3158 -0.91594 15.9698 2.74782L16.4698 3.24956C18.9938 11.6481 18.7608 20.5341 16.4698 29.7841L2.73975 16.0151C-0.91325 12.3513 -0.91325 6.41159 2.73975 2.74782Z" fill="none" stroke="url(#bevel)" stroke-width="0.7"/>
            </svg>
          `)}`}
          alt=""
          width={110}
          height={97}
        />
      </div>
    ),
    { ...size }
  );
}
