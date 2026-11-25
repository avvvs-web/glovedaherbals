import { whatsappUrl } from "@/lib/whatsapp";

/** A floating button that opens a WhatsApp chat with Gloveda Herbals' support line. */
export function WhatsAppButton() {
  return (
    <a className="wa-float" href={whatsappUrl("Hello Gloveda Herbals, I have a question.")} target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp (opens in a new tab)">
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" fill="currentColor">
        <path d="M16 3.2A12.7 12.7 0 0 0 5.1 22.4L3.3 28.8l6.6-1.7A12.8 12.8 0 1 0 16 3.2Zm0 23.3a10.5 10.5 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.5Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-2.6-1.6 9.6 9.6 0 0 1-1.8-2.2c-.2-.3 0-.5.1-.7l.5-.6.3-.5a.6.6 0 0 0 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.5 6.5 0 0 0 1.3 3.4 14.6 14.6 0 0 0 5.6 5c2.1.9 2.9 1 3.9.8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.1-.3-.2-.6-.4Z" />
      </svg>
    </a>
  );
}
