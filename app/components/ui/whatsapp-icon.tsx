import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

type WhatsAppIconProps = {
  className?: string;
  size?: number | string;
};

export function WhatsAppIcon({ className, size = 24 }: WhatsAppIconProps) {
  return (
    <FaWhatsapp
      className={cn("text-current", className)}
      size={size}
      aria-hidden="true"
    />
  );
}
