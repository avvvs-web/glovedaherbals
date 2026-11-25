import { Reveal } from "@/components/motion/Reveal";

/**
 * Our story, on the main page. Dates, names and the founding account are from the brand's own About page;
 * the closing entry uses the statements the client approved (doctor-formulated, made in house, small batch).
 */
const chapters = [
  {
    year: "1921",
    name: "Sri K. Neelakandan Vaidyar",
    role: "Founder",
    body: "Arya Vaidya Vilasini Vaidya Sala is established in Kozhikode with the blessings of Sree Narayana Guru, as a pharmacy preparing and dispensing Ayurveda medicines.",
  },
  {
    year: "1960",
    name: "Sri K.N. Ramadas Vaidyar",
    role: "Successor",
    body: "His son carries the practice forward, and becomes known in Kozhikode's literary circles for his satire.",
  },
  {
    year: "Today",
    name: "Gloveda Herbals",
    role: "Skincare and hair care",
    body: "The same practice, made for everyday care. Formulated by doctors, in small batches, under our own roof.",
  },
];

export function OurStory() {
  return (
    <section id="our-story" className="gl-section story" aria-labelledby="our-story-title">
      <div className="gl-container story__grid">
        <Reveal className="story__lead">
          <p className="story__name">Our story</p>
          <h2 id="our-story-title" className="story__title">
            The Vaidyars behind 105 years
          </h2>
          <p className="story__intro">A lineage of healers, scholars and visionaries, rooted in the ancient science of Ayurveda.</p>
        </Reveal>
        <ol className="story__timeline" role="list">
          {chapters.map((c, i) => (
            <li key={c.year}>
              <Reveal className="story__entry" delay={i * 0.08}>
                <p className="story__year">{c.year}</p>
                <div className="story__text">
                  <h3 className="story__person">{c.name}</h3>
                  <p className="story__role">{c.role}</p>
                  <p className="story__body">{c.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
