import { weddingConfig } from '../config/weddingConfig';
import { GoldDivider, Namam } from './Ornaments';
import { Reveal } from './Reveal';

function ParentsColumn({ label, names }: { label: string; names: readonly string[] }) {
  return (
    <div className="min-w-0">
      <p className="text-label font-semibold text-gold-ink">{label}</p>
      <p className="mt-1 font-display text-[1.5rem] leading-snug font-semibold">
        {names.map((name) => (
          <span key={name} className="block">
            {name}
          </span>
        ))}
      </p>
    </div>
  );
}

export function FamilySection() {
  const { family, couple } = weddingConfig;
  return (
    <section className="section overflow-clip" aria-labelledby="family-heading">
      <div className="temple-watermark" aria-hidden="true" />
      <Reveal className="wrap text-center">
        <Namam className="mx-auto h-14 w-12" />
        <h2 id="family-heading" className="mt-4">
          {family.hostsLabel}
        </h2>
        <p className="mt-3 font-display text-statement leading-tight font-semibold">
          {family.hosts.map((host) => (
            <span key={host} className="block">
              {host}
            </span>
          ))}
        </p>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-[minmax(0,1fr)] gap-8 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
          <ParentsColumn label={family.groomSideLabel} names={couple.groom.parents} />
          <ParentsColumn label={family.brideSideLabel} names={couple.bride.parents} />
        </div>

        <GoldDivider className="mt-12" />
        <p className="mt-4 text-lede text-ink-2">{family.compliments}</p>
      </Reveal>
    </section>
  );
}
