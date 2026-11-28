"use server";

import { redirect } from "next/navigation";
import { currentSession, deleteAddress, saveAddress, updateName, type Saved, type Session } from "@/lib/shop/customer";
import { shopUrl } from "@/lib/site";

/**
 * Changes the signed-in customer makes to their own account. Each one is sent to Shopify, which holds
 * the account, and the customer returns to the tab they were on with either "saved" or the store's own
 * explanation of what was wrong. Nothing is kept on this site.
 */
const text = (form: FormData, key: string, max = 120) => String(form.get(key) ?? "").trim().slice(0, max);

async function signedIn(tab: string): Promise<Session> {
  const s = await currentSession();
  if (s === "expired") redirect(shopUrl(`/account/refresh?to=${encodeURIComponent(`/account?tab=${tab}`)}`));
  if (s === "none") redirect(shopUrl(`/account?tab=${tab}&signin=expired`));
  return s;
}

function back(tab: string, result: Saved): never {
  redirect(shopUrl(`/account?tab=${tab}&${result.ok ? "saved=1" : `problem=${encodeURIComponent(result.message.slice(0, 240))}`}`));
}

export async function saveProfileAction(form: FormData) {
  const session = await signedIn("profile");
  const first = text(form, "firstName", 60);
  if (!first) back("profile", { ok: false, message: "Please enter your first name." });
  back("profile", await updateName(session, first, text(form, "lastName", 60)));
}

/** An Indian mobile number as typed (with or without +91, spaces or dashes), in the form Shopify stores. */
function phone(raw: string): string | null {
  if (!raw) return "";
  const digits = raw.replace(/[^\d+]/g, "");
  const m = /^(?:\+?91|0)?([6-9]\d{9})$/.exec(digits);
  return m ? `+91${m[1]}` : null;
}

export async function saveAddressAction(form: FormData) {
  const session = await signedIn("addresses");
  const fields = {
    firstName: text(form, "firstName", 60),
    lastName: text(form, "lastName", 60),
    address1: text(form, "address1"),
    address2: text(form, "address2"),
    city: text(form, "city", 60),
    zoneCode: text(form, "zoneCode", 4).toUpperCase(),
    zip: text(form, "zip", 6),
    phoneNumber: "",
  };
  const number = phone(text(form, "phoneNumber", 20));
  if (!fields.firstName || !fields.address1 || !fields.city || !fields.zoneCode) back("addresses", { ok: false, message: "Please fill in the name, address, city and state." });
  if (!/^\d{6}$/.test(fields.zip)) back("addresses", { ok: false, message: "Please enter a six-digit PIN code." });
  if (number === null) back("addresses", { ok: false, message: "Please enter a ten-digit mobile number." });
  const id = text(form, "id", 80);
  back("addresses", await saveAddress(session, { ...fields, phoneNumber: number ?? "" }, form.get("makeDefault") === "on", id || undefined));
}

export async function deleteAddressAction(form: FormData) {
  const session = await signedIn("addresses");
  const id = text(form, "id", 80);
  if (!id) back("addresses", { ok: false, message: "That address could not be found." });
  back("addresses", await deleteAddress(session, id));
}
