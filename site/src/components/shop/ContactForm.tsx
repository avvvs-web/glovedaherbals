"use client";

import { useState } from "react";

const TOPICS = ["An order", "Delivery", "A return or refund", "A product", "Something else"];

/**
 * Write to the team. This site has no server of its own to send mail from, so the form puts the message
 * together and hands it to the visitor's own email app, addressed to the store, with the order ID in the
 * subject line (which is what the returns policy asks for). Nothing is sent or stored by this site.
 */
export function ContactForm({ email }: { email: string }) {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [order, setOrder] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const subject = order.trim() ? `Order ${order.trim()}: ${topic}` : topic;
  const body = `${message.trim()}${name.trim() ? `\n\n${name.trim()}` : ""}`;
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const ready = message.trim().length > 0;

  return (
    <form
      className="gx-contact"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) window.location.href = href;
      }}
    >
      <div className="gx-contact__row">
        <label className="gl-field">
          <span className="gl-label">What is it about?</span>
          <select className="gl-select" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="gl-field">
          <span className="gl-label">Order ID, if you have one</span>
          <input className="gl-input" type="text" autoComplete="off" value={order} onChange={(e) => setOrder(e.target.value)} />
        </label>
      </div>
      <label className="gl-field">
        <span className="gl-label">Your name</span>
        <input className="gl-input" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="gl-field">
        <span className="gl-label">Your message</span>
        <textarea className="gl-input gx-contact__message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <div className="gx-contact__foot">
        <button type="submit" className="gl-btn" disabled={!ready}>
          Write the email
        </button>
        <p className="gl-small">This opens your email app with the message ready to send to {email}.</p>
      </div>
    </form>
  );
}
