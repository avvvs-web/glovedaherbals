/**
 * The shop's policies, rewritten on 2026-11-22 for the current set-up: a story site plus a shop whose
 * cart hands over to Shopify's checkout. There are no customer accounts, no wallet, no mobile app and no
 * prescription products here, so the clauses about those in the earlier (pharmacy-style) policies are gone.
 *
 * Every fact below comes from the store's existing published policies or pages. Items in `confirm` are
 * business or legal decisions the brand must sign off before launch; they are shown only in development.
 * These are drafts and need a legal review before they go live.
 */
export type PolicySection = { heading: string; body?: string[]; list?: string[] };
export type Policy = { handle: string; title: string; summary: string; updated: string; sections: PolicySection[]; confirm: string[] };

export const COMPANY = {
  name: "Arya Vaidya Vilasini Vaidya Sala",
  brand: "Gloveda Herbals",
  registeredOffice: "Taluk Road, Puthiyara PO, Kozhikode, Kerala, India, 673004",
  email: "mail@glovedaherbals.com",
  phone: "+91 80892 02092",
  grievanceOfficer: { name: "Dr. Rekha K.C", email: "pm@avvvs.com", phone: "+91 80892 02091" },
};

const UPDATED = "22 November 2026";
const contact: PolicySection = {
  heading: "Contact us",
  body: [`Email ${COMPANY.email} or call ${COMPANY.phone}.`, `${COMPANY.name}, ${COMPANY.registeredOffice}.`],
};

export const policies: Policy[] = [
  {
    handle: "shipping-policy",
    title: "Shipping policy",
    summary: "When your order ships and how long it takes to arrive.",
    updated: UPDATED,
    sections: [
      {
        heading: "Delivery time",
        body: [
          "Orders usually arrive 3 to 4 business days after they are shipped. Business days do not include Sundays and public holidays.",
          "The estimate can vary a little from state to state.",
        ],
      },
      { heading: "Shipping charges", body: ["Shipping is free on orders above ₹499. Any shipping charge for smaller orders is shown at checkout before you pay."] },
      {
        heading: "Delays",
        body: [
          "We do our best to deliver within the estimated time. Now and then a courier or logistics problem outside our control causes a delay, and we are not liable for delays of that kind. If your order is late, write to us and we will find out where it is.",
        ],
      },
      contact,
    ],
    confirm: [
      "The ₹499 free-shipping threshold (from the live home page) and the charge below it.",
      "Whether orders ship only within India.",
      "Dispatch time (how long after ordering an order is shipped).",
    ],
  },
  {
    handle: "refund-policy",
    title: "Returns and refunds",
    summary: "When we refund in full, how to return a product, and how long refunds take.",
    updated: UPDATED,
    sections: [
      {
        heading: "When we refund in full",
        list: [
          "You received a defective item.",
          "Your order was lost or damaged in transit.",
          "An item is past its expiry date.",
          "An item is missing from your order.",
        ],
      },
      {
        heading: "How to ask for a refund",
        body: [
          `Email ${COMPANY.email} with your order ID as the subject line.`,
          "For a defective or damaged item, attach a photo of it. For a missing item, tell us which item is missing. We review the packing video for missing-item claims.",
        ],
      },
      {
        heading: "Returning a product you no longer want",
        body: [
          "You may return unopened, unused products if you tell us within 30 working days of receiving them. A 20% restocking charge is deducted from the refund.",
          "Some products cannot be returned. Where that applies, the product page says so.",
        ],
      },
      {
        heading: "How long refunds take",
        body: [
          "Refunds to a credit card, debit card or net banking usually appear within 7 to 10 working days. That timing is set by the bank.",
          "For cash-on-delivery orders we need a photo of a cancelled cheque or a bank statement to confirm your account details. Once approved, these refunds can take up to 3 weeks.",
        ],
      },
      contact,
    ],
    confirm: [
      "The return window: the existing policy says 30 working days; the live home page says \"30-Days Return Policy\".",
      "The 20% restocking charge on unwanted returns.",
      "Who pays return shipping, and the return address.",
      "The earlier policy offered refunds to a \"customer wallet\" and a waiver when a doctor changes a prescription. Both are removed here, because the new shop has no wallet and sells no prescription products.",
      "Whether cash on delivery is still offered.",
    ],
  },
  {
    handle: "privacy-policy",
    title: "Privacy policy",
    summary: "What information we collect when you browse and order, and what we do with it.",
    updated: UPDATED,
    sections: [
      {
        heading: "Who we are",
        body: [`${COMPANY.brand} is a brand of ${COMPANY.name}, whose registered office is at ${COMPANY.registeredOffice}. We run this website and shop.`],
      },
      {
        heading: "What we collect",
        list: [
          "When you order: your name, delivery address, phone number, email address and what you bought. You give these at checkout, which is run by Shopify.",
          "Payment details: these go straight to the payment provider at checkout. We do not see or store your full card details.",
          "Your cart: the products in your cart are kept in your own browser so they are still there when you come back. They are not sent to us until you check out.",
          "When you write to us: your message and contact details.",
          "Technical information: like most websites, our hosting records basic details such as your IP address, browser and the pages requested, to keep the site secure and working.",
        ],
      },
      { heading: "Accounts", body: ["You do not need an account to browse or to order on this site."] },
      {
        heading: "How we use it",
        list: ["To process, deliver and support your order.", "To answer your questions and resolve complaints.", "To keep the site secure and prevent fraud.", "To meet our legal and tax obligations."],
      },
      {
        heading: "Who we share it with",
        body: [
          "We share only what is needed with the companies that help us fulfil your order: Shopify, which runs our checkout and order system; payment providers; and courier partners. We also share information when the law requires it. We do not sell your personal information.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "This site keeps your cart in your browser's storage. The checkout, run by Shopify, uses cookies that are necessary to take your order. You can clear or block these in your browser settings, though the cart and checkout may then not work.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          `You can ask us for a copy of the personal information we hold about you, ask us to correct it, or ask us to delete it, by emailing ${COMPANY.email}. We keep order records for as long as the law requires.`,
        ],
      },
      { heading: "Children", body: ["This site is not meant for anyone under 18, and we do not knowingly collect their information."] },
      {
        heading: "Grievance officer",
        body: [
          `If you have a complaint about how your information is handled, contact our Grievance Officer, ${COMPANY.grievanceOfficer.name}, at ${COMPANY.grievanceOfficer.email} or ${COMPANY.grievanceOfficer.phone}.`,
        ],
      },
      { heading: "Governing law", body: ["This policy is governed by the laws of India. Disputes are subject to the courts of Kozhikode, Kerala."] },
      contact,
    ],
    confirm: [
      "Whether any analytics, advertising pixels or marketing email will run on the new site. The policy currently says none do; it must change if they are added.",
      "The Grievance Officer's name, email and phone, taken from the existing policy.",
      "How long order records are kept.",
      "A legal review against India's Digital Personal Data Protection Act.",
    ],
  },
  {
    handle: "terms-of-service",
    title: "Terms of service",
    summary: "The terms that apply when you use this website and buy from the shop.",
    updated: UPDATED,
    sections: [
      {
        heading: "About these terms",
        body: [
          `This website and shop are run by ${COMPANY.name} (${COMPANY.registeredOffice}), under the brand ${COMPANY.brand}. By using the site or placing an order you agree to these terms and to our privacy, shipping and returns policies.`,
          "You must be 18 or older, and able to enter a legally binding contract, to place an order.",
        ],
      },
      {
        heading: "Our products",
        body: [
          "We sell cosmetic and personal-care products. Information on this site describes the products and how to use them. It is not medical advice, and it is not a substitute for advice from a doctor.",
          "Individual results may vary. If you have a skin condition, an allergy or a concern about an ingredient, check with a doctor before use, and stop using a product if it irritates your skin.",
        ],
      },
      {
        heading: "Orders and prices",
        body: [
          "Prices are shown in Indian rupees. The total, including any shipping charge, is shown at checkout before you pay.",
          "Checkout and payment are handled by Shopify and its payment providers. All orders depend on stock being available. Your order is accepted when it is shipped and we send you a shipping confirmation. We may refuse or cancel an order, for example if a product is out of stock or a price was shown in error; if you have already paid, we refund you in full.",
          "Products are sold for personal use, not for resale.",
        ],
      },
      { heading: "Shipping, returns and refunds", body: ["These are covered by our shipping policy and our returns and refunds policy."] },
      {
        heading: "Using this website",
        body: [
          "Please do not misuse the site: do not try to break or overload it, gain access you are not entitled to, or use it for anything unlawful.",
          "Everything on this site, including the text, photographs, film, logos and design, belongs to us or our licensors. You may not copy or reuse it without our written permission.",
        ],
      },
      {
        heading: "Our responsibility to you",
        body: [
          "We take care to keep this site accurate and available, but we cannot promise it will always be free of errors or interruptions. To the extent the law allows, our liability for any order is limited to the amount you paid for it. Nothing in these terms limits rights you have under consumer law.",
        ],
      },
      {
        heading: "Complaints",
        body: [
          `Write to us at ${COMPANY.email}. If you are not satisfied with the response, contact our Grievance Officer, ${COMPANY.grievanceOfficer.name}, at ${COMPANY.grievanceOfficer.email}.`,
        ],
      },
      { heading: "Governing law", body: ["These terms are governed by the laws of India. Disputes are subject to the courts of Kozhikode, Kerala."] },
      { heading: "Changes", body: ["We may update these terms. The date at the top shows when they last changed."] },
      contact,
    ],
    confirm: [
      "Whether prices include all taxes.",
      "The liability wording and the right to cancel orders, with a lawyer.",
      "The earlier terms covered prescription medicines, account registration, a mobile app and SMS marketing consent. All are removed here because none applies to the new shop. Add marketing consent back if marketing messages will be sent.",
      "The Nodal Officer named in the earlier terms is not carried over; say if it should be.",
    ],
  },
];

export const policyByHandle = (handle: string) => policies.find((p) => p.handle === handle);
