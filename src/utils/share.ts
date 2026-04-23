import { siteConfig } from "@/config/site";

export function generateWhatsAppLink(devoteePhone: string, uniqueToken: string) {
  // Use window.location.origin on client, or env var on server
  const portalUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"); 
  const link = `${portalUrl}/shared/${uniqueToken}`;
  
  const message = `Greetings from ${siteConfig.name}. Thank you for your generous donation today. You can view and download your official receipts here: ${link}`;
  
  const encodedMessage = encodeURIComponent(message);
  
  // Format phone number (remove spaces, etc). Ensure it has country code if not provided
  const formattedPhone = devoteePhone.replace(/\D/g, '');
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}
