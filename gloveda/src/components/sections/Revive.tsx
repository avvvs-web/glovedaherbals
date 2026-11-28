import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { reviveUrl } from "@/lib/site";

/**
 * Gloveda Revive, the brand's skin and hair clinics and their partnership model. Wording is taken from
 * revive.gloveda.co (read 2026-11-28); its outcome claims ("visible outcomes from the first sessions")
 * and partnership costs are deliberately left out, as they were for Gloveda Experience.
 */
const ways = [
  { name: "A Revive clinic", text: "Run a full Gloveda Revive clinic in your town, under our name and protocols." },
  { name: "Salons and spas", text: "Add a Revive treatment room and the Ayur-Medi facial menu to your salon or spa." },
  { name: "Ayurveda and wellness centres", text: "Bring doctor-led Ayurvedic cosmetology into your existing practice." },
  { name: "Hospitals and polyclinics", text: "Offer Ayurvedic skin and hair care as a department of its own." },
];
const receives = [
  { name: "Proven Ayurvedic formulations", text: "Proprietary blends from our own manufacturing unit." },
  { name: "SOPs and doctor-supported protocols", text: "Every treatment standardised with physician oversight." },
  { name: "Staff training and operations support", text: "Onboarding, ongoing education and quality checks for your team." },
  { name: "A trusted heritage brand", text: "A name Kerala has trusted since 1921, working for your location from day one." },
  { name: "Retail products for home care", text: "Take-home Ayurvedic skincare for your clients." },
];
const treatments = [
  { name: "Signature Ayur-Medi facials", text: "Doctor-led facials that pair Ayurvedic formulations with modern skin technology. 8 treatments.", href: reviveUrl("/treatments#face") },
  { name: "Hair care therapies", text: "Scalp-first Ayurvedic treatments for the scalp and hair. 3 treatments.", href: reviveUrl("/treatments#hair") },
  { name: "Revive rituals", text: "Short, restorative treatments for tired eyes and feet. 2 treatments.", href: reviveUrl("/treatments#eyes-feet") },
];

export function Revive() {
  return (
    <section id="revive" className="gx-band gx-band--sand revive" aria-labelledby="revive-title">
      <div className="gl-container">
        <Reveal className="gx-stack revive__head">
          <p className="gx-label">Gloveda Revive</p>
          <h2 id="revive-title" className="gx-display">
            Bring Gloveda Revive to your town.
          </h2>
          <p className="gx-lead">A 105-year-old Ayurvedic legacy, equipped with formulations, protocols and training.</p>
          <p className="gl-body">
            Revive is expanding across Kerala and beyond. Partner with us to run a Revive clinic, or add a Revive treatment room to your existing salon, spa or Ayurveda
            centre.
          </p>
        </Reveal>

        <ul className="revive__ways" role="list" aria-label="Four ways to partner">
          {ways.map((w, i) => (
            <li key={w.name}>
              <Reveal className="revive__way" delay={i * 0.05}>
                <h3 className="revive__wayName">{w.name}</h3>
                <p className="revive__wayText">{w.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="revive__ledger" delay={0.05}>
          <div>
            <h3 className="revive__sub">What every partner receives</h3>
            <ul className="revive__list" role="list">
              {receives.map((r) => (
                <li key={r.name}>
                  <strong>{r.name}</strong>
                  <span>{r.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="revive__sub">13 treatments, ready to run</h3>
            <ul className="revive__list" role="list">
              {treatments.map((t) => (
                <li key={t.name}>
                  <strong>
                    <a className="gl-link" href={t.href}>
                      {t.name}
                    </a>
                  </strong>
                  <span>{t.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="revive__actions" delay={0.08}>
          <a className="gl-btn" href={reviveUrl("/#partner")}>
            Start a partnership
          </a>
          <a className="gl-btn gl-btn--secondary" href={reviveUrl("/clinics")}>
            Find a Revive clinic
          </a>
          <a className="gx-more" href={reviveUrl("/treatments")}>
            See the treatment menu <Icon name="arrow" size={18} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
