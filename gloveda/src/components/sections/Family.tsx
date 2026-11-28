import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { EXPERIENCE_URL, reviveUrl, shopUrl } from "@/lib/site";

/**
 * The Gloveda family: gloveda.co is the parent site of three houses (client, 2026-11-28). Each line is
 * taken from that house's own site or from the claims the client approved; nothing is added.
 */
const houses = [
  {
    name: "Gloveda Herbals",
    what: "Skincare and hair care",
    text: "Ayurvedic face, hair and body care, formulated by doctors and made in small batches under our own roof.",
    action: "Visit the shop",
    href: shopUrl("/"),
  },
  {
    name: "Gloveda Experience",
    what: "For hotels, resorts and wellness properties",
    text: "A century of Ayurvedic wisdom as a luxury sensory experience, tailored for five-star properties and wellness destinations.",
    action: "Explore Gloveda Experience",
    href: EXPERIENCE_URL,
  },
  {
    name: "Gloveda Revive",
    what: "Ayurvedic skin and hair clinics",
    text: "Doctor-led Ayur-Medi facials and hair and scalp therapies, in Revive clinics in Kozhikode and Kannur and in partner centres.",
    action: "Explore Gloveda Revive",
    href: reviveUrl("/"),
  },
];

export function Family() {
  return (
    <section id="family" className="gx-band family" aria-labelledby="family-title">
      <div className="gl-container">
        <Reveal className="gx-head">
          <p className="gx-label">The Gloveda family</p>
          <h2 id="family-title" className="gx-display">
            One heritage, three houses.
          </h2>
        </Reveal>
        <ul className="family__list" role="list">
          {houses.map((h, i) => (
            <li key={h.name}>
              <Reveal className="family__door" delay={i * 0.06}>
                <h3 className="family__name">{h.name}</h3>
                <p className="family__what">{h.what}</p>
                <p className="family__text">{h.text}</p>
                <a className="gx-more" href={h.href}>
                  {h.action} <Icon name="arrow" size={18} />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
