import { useCallback, useEffect, useState } from 'react';
import { BlessingsSection } from '../components/BlessingsSection';
import { CardViewer } from '../components/CardViewer';
import { CoupleSection } from '../components/CoupleSection';
import { Countdown } from '../components/Countdown';
import { FamilySection } from '../components/FamilySection';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { InvitationEnvelope } from '../components/InvitationEnvelope';
import { InvitationGallery } from '../components/InvitationGallery';
import { MusicPlayer } from '../components/MusicPlayer';
import { SiteNav } from '../components/SiteNav';
import { VenueSection } from '../components/VenueSection';
import { WeddingDetails } from '../components/WeddingDetails';
import { WelcomeSection } from '../components/WelcomeSection';
import { weddingConfig } from '../config/weddingConfig';

/** A guest opens the envelope, reads the card, then closes it to reach the site. */
type Stage = 'envelope' | 'card' | 'site';

/** A link straight to a section, such as /#venue, goes there without the opening. */
const startsOnSection = () => window.location.hash.length > 1;

export default function Home() {
  const [stage, setStage] = useState<Stage>(() => (startsOnSection() ? 'site' : 'envelope'));
  const [envelopeGone, setEnvelopeGone] = useState(startsOnSection);
  const siteOpen = stage === 'site';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('scroll-locked', !siteOpen);
    return () => root.classList.remove('scroll-locked');
  }, [siteOpen]);

  // The browser's own jump to the fragment runs before these sections exist.
  useEffect(() => {
    if (startsOnSection()) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    }
  }, []);

  // Every guest sees both card photographs next, so have them ready when the envelope opens.
  useEffect(() => {
    if (startsOnSection()) return;
    for (const page of weddingConfig.invitation.pages) {
      const image = new Image();
      image.src = page.preview;
    }
  }, []);

  const onReveal = useCallback(() => setStage('card'), []);
  const onEnvelopeGone = useCallback(() => setEnvelopeGone(true), []);
  const onCardClosed = useCallback(() => {
    setStage('site');
    document.getElementById('main')?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      {siteOpen && (
        <a className="skip-link" href="#main">
          Skip to content
        </a>
      )}

      {!envelopeGone && <InvitationEnvelope onReveal={onReveal} onDone={onEnvelopeGone} />}
      {stage === 'card' && <CardViewer initialPage={0} openDoors onClose={onCardClosed} />}

      <div className="site-frame" inert={!siteOpen}>
        <SiteNav />
        <main id="main" tabIndex={-1} className="outline-none">
          <HeroSection show={siteOpen} />
          <WelcomeSection />
          <CoupleSection />
          <Countdown />
          <WeddingDetails />
          <VenueSection />
          <InvitationGallery />
          <FamilySection />
          <BlessingsSection />
        </main>
        <Footer />
      </div>

      <MusicPlayer visible={siteOpen} />
    </>
  );
}
