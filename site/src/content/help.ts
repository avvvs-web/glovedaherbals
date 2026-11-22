import { COMPANY } from "./policies";

/**
 * The help centre's questions and answers. Nothing here is new information: every answer restates the
 * store's own published FAQ page (glovedaherbals.com/pages/faqs, read on 2026-11-23) or this site's
 * policies (src/content/policies.ts), and says which. Where those two sources disagree, the item is
 * listed in `HELP_CONFIRM` for the brand to settle; that list is shown only in development.
 */
export type HelpItem = { q: string; a: string[]; link?: { label: string; href: `/${string}` } };
export type HelpTopic = { id: string; title: string; blurb: string; items: HelpItem[] };

export const helpTopics: HelpTopic[] = [
  {
    id: "orders",
    title: "Orders",
    blurb: "Placing, changing and cancelling an order.",
    items: [
      {
        q: "Can I change or cancel my order?",
        a: ["Yes, as long as it has not been shipped. Contact us as early as you can with your order details. Once an order has been dispatched it may no longer be possible to change it."],
      },
      {
        q: "What details do I need to give when I order?",
        a: ["Your full name, complete delivery address, mobile number and email address. Please check them before you pay: correct details mean smooth processing and delivery on time."],
      },
      {
        q: "Do I need an account to order?",
        a: ["No. You do not need an account to browse or to order."],
        link: { label: "Privacy policy", href: "/policies/privacy-policy" },
      },
      {
        q: "When is my order confirmed?",
        a: ["All orders depend on stock being available. Your order is accepted when it is shipped and we send you a shipping confirmation. If we have to cancel an order you have already paid for, for example because a product is out of stock, we refund you in full."],
        link: { label: "Terms of service", href: "/policies/terms-of-service" },
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    blurb: "Ways to pay, prices and gift cards.",
    items: [
      {
        q: "How can I pay?",
        a: ["By credit or debit card, UPI, net banking and other supported digital payment methods. Checkout and payment are handled by Shopify and its payment providers, through secure, encrypted gateways."],
      },
      {
        q: "Are there any charges beyond the price shown?",
        a: ["Prices are shown in Indian rupees. The total, including any shipping charge, is shown at checkout before you pay."],
      },
      {
        q: "How do I use a gift card?",
        a: ["Add your products to the bag and enter the gift card code in its field at checkout. The amount is taken off your order total."],
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    blurb: "Shipping charges, delivery time and late orders.",
    items: [
      {
        q: "How long does delivery take?",
        a: ["Orders usually arrive 3 to 4 business days after they are shipped. Business days do not include Sundays and public holidays, and the estimate can vary a little from state to state."],
        link: { label: "Shipping policy", href: "/policies/shipping-policy" },
      },
      {
        q: "How much is shipping?",
        a: ["Shipping is free on orders above ₹499. Any shipping charge for smaller orders is shown at checkout before you pay."],
        link: { label: "Shipping policy", href: "/policies/shipping-policy" },
      },
      {
        q: "My order is late. What should I do?",
        a: ["Write to us with your order ID and we will find out where it is. Now and then a courier or logistics problem outside our control causes a delay."],
      },
    ],
  },
  {
    id: "returns",
    title: "Returns and refunds",
    blurb: "Damaged or wrong items, returns and how refunds are paid.",
    items: [
      {
        q: "My product arrived damaged, defective or wrong. What now?",
        a: [
          "Contact us within 48 hours of delivery with your order details and clear photos of the problem. Once we have reviewed it we arrange a replacement or a refund.",
          "We refund in full when an item is defective, lost or damaged in transit, past its expiry date, or missing from your order.",
        ],
        link: { label: "Returns and refunds", href: "/policies/refund-policy" },
      },
      {
        q: "How do I ask for a refund?",
        a: [`Email ${COMPANY.email} with your order ID as the subject line. For a defective or damaged item, attach a photo of it. For a missing item, tell us which item is missing.`],
        link: { label: "Returns and refunds", href: "/policies/refund-policy" },
      },
      {
        q: "Can I return a product I no longer want?",
        a: ["You may return unopened, unused products if you tell us within 30 working days of receiving them. A 20% restocking charge is deducted from the refund. Some products cannot be returned; where that applies, the product page says so."],
        link: { label: "Returns and refunds", href: "/policies/refund-policy" },
      },
      {
        q: "How long does a refund take?",
        a: [
          "Refunds to a credit card, debit card or net banking usually appear within 7 to 10 working days. That timing is set by the bank.",
          "For cash-on-delivery orders we need a photo of a cancelled cheque or a bank statement to confirm your account details. Once approved, these refunds can take up to 3 weeks.",
        ],
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    blurb: "Choosing, using and reviewing a product.",
    items: [
      {
        q: "Which product is right for me?",
        a: ["Start from what you want to care for. Shop by concern lists the products whose own description speaks to it, with the line that does. Each product page also shows what it helps with and how to use it."],
        link: { label: "Shop by concern", href: "/concerns" },
      },
      {
        q: "Is a product suitable if I have a skin condition or an allergy?",
        a: ["Individual results may vary. If you have a skin condition, an allergy or a concern about an ingredient, check with a doctor before use, and stop using a product if it irritates your skin."],
        link: { label: "Terms of service", href: "/policies/terms-of-service" },
      },
      {
        q: "How do I leave a review?",
        a: ["Open the product's page and go to Reviews near the bottom. Choose Write a review there."],
      },
    ],
  },
  {
    id: "contact",
    title: "Getting in touch",
    blurb: "How to reach us and how soon we reply.",
    items: [
      {
        q: "How do I contact Gloveda Herbals?",
        a: [`Email ${COMPANY.email} or call ${COMPANY.phone}. For anything about an order, include your order ID so we can help faster.`, "We aim to reply to every enquiry within 24 to 48 working hours."],
      },
      {
        q: "I have a complaint that was not resolved. Who do I write to?",
        a: [`Our grievance officer is ${COMPANY.grievanceOfficer.name}: ${COMPANY.grievanceOfficer.email}, ${COMPANY.grievanceOfficer.phone}.`],
        link: { label: "Privacy policy", href: "/policies/privacy-policy" },
      },
    ],
  },
];

/** Open points for the brand. Shown on the help page in development only. */
export const HELP_CONFIRM = [
  `Support email: the live FAQ says support@gloveda.com; the published policies say ${COMPANY.email} (used here).`,
  "Damaged or wrong items: the live FAQ asks customers to write within 48 hours of delivery; the returns policy gives no time limit. The 48 hours is shown here.",
  "Returns: the live FAQ says returns are accepted only for damaged, defective or incorrect items; the returns policy also allows unopened returns within 30 working days with a 20% charge; the live contact page says \"30-Days Return Policy\".",
  "Order tracking: the live footer's Track My Order link goes nowhere. Tell us how customers track an order (courier link in the shipping email, or a tracking page) and it will be added.",
  "The live contact page says \"24/7 Free Support\"; the FAQ says replies within 24 to 48 working hours (used here).",
  "WhatsApp number for support, if there is one.",
];
