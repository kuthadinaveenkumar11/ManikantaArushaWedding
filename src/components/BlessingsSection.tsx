import { weddingConfig } from '../config/weddingConfig';
import { Reveal } from './Reveal';

export function BlessingsSection() {
  const { blessings } = weddingConfig.copy;
  return (
    <section className="relative isolate bg-paper-2" aria-labelledby="blessings-heading">
      <div className="garland" aria-hidden="true" />
      <Reveal className="wrap pt-44 pb-16 text-center lg:pt-56">
        <h2 id="blessings-heading" className="mx-auto max-w-[18ch]">
          {blessings.heading}
        </h2>
        <p className="mt-5 text-lede text-ink-2">{blessings.meaning}</p>
        <p className="mt-2 text-lede text-ink-2">{blessings.closing}</p>
      </Reveal>
      <div className="botanical" aria-hidden="true" />
    </section>
  );
}
