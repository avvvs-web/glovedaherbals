import { Reveal } from "@/components/motion/Reveal";
import { EXPERIENCE_URL } from "@/lib/site";

/**
 * Gloveda Experience, for hotels, resorts and wellness properties. Wording is taken from
 * glovedaexperience.com; its results, revenue and "clinically validated" claims are deliberately left out.
 */
const offerings = ["Ayur Medi Facials", "Hair & Scalp Therapies", "Body Care Therapies", "Hastha Pada Kanthi"];
const partnership = [
  "Exclusive Ayurvedic cosmetic formulations",
  "Doctor-supported protocols and systems",
  "Staff training and operational support",
  "Premium brand alignment",
  "Curated retail products for continuity care",
];

export function ExperiencePartners() {
  return (
    <section id="experience" className="theme-wine experience" aria-labelledby="experience-title">
      <div className="gl-container experience__inner">
        <Reveal className="experience__lead">
          <p className="experience__name">
            <span>Gloveda Experience</span>
          </p>
          <h2 id="experience-title" className="experience__title">
            Where heritage meets high‑end hospitality
          </h2>
          <p className="experience__intro">
            105 years of Ayurvedic wisdom as a luxury sensory experience, tailored for five-star properties and wellness destinations.
          </p>
        </Reveal>

        <Reveal className="experience__ledger" delay={0.1}>
          <div className="experience__col">
            <h3 className="experience__head">Signature offerings</h3>
            <ul className="experience__list experience__list--large" role="list">
              {offerings.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
          <div className="experience__col">
            <h3 className="experience__head">A turnkey, modular partnership</h3>
            <ul className="experience__list" role="list">
              {partnership.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="experience__action" delay={0.15}>
          <a className="gl-btn" href={EXPERIENCE_URL}>
            Partner with us<span className="visually-hidden"> at Gloveda Experience</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
