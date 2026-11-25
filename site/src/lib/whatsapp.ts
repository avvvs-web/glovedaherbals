import { COMPANY } from "@/content/policies";

/** The support line, which the client confirmed is on WhatsApp (2026-11-25). */
export const WHATSAPP_NUMBER = COMPANY.phone.replace(/\D/g, "");

/** A wa.me link that opens a chat with the support line, with an optional message already typed. */
export const whatsappUrl = (text?: string) => `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
