import { useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { weddingConfig, type InvitationPage } from '../config/weddingConfig';
import { CardViewer } from './CardViewer';
import { Reveal } from './Reveal';

interface ViewerState {
  page: number;
  openDoors: boolean;
}

/** Lets the browser choose the lighter copy unless the screen can use the original. */
const sourceSet = (page: InvitationPage) =>
  `${page.preview} ${page.previewWidth}w, ${page.src} ${page.width}w`;

export function InvitationGallery() {
  const { invitation, copy } = weddingConfig;
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const cover = invitation.pages[0];

  const open = (state: ViewerState) => (event: React.MouseEvent<HTMLElement>) => {
    returnFocus.current = event.currentTarget;
    setViewer(state);
  };

  return (
    <section id="card" className="section on-stone" aria-labelledby="card-heading">
      <div className="wrap gallery-grid">
        <Reveal className="gallery-grid__head">
          <h2 id="card-heading">{copy.gallery.heading}</h2>
          <p className="mt-4 max-w-[38ch] text-lede text-on-stone-2">{copy.gallery.body}</p>
        </Reveal>

        <Reveal index={1} className="gallery-grid__cover card-frame mx-auto w-full max-w-sm lg:max-w-md">
          <img
            className="card-photo"
            src={cover.src}
            srcSet={sourceSet(cover)}
            sizes="(min-width: 64rem) 28rem, min(24rem, 92vw)"
            width={cover.width}
            height={cover.height}
            alt={cover.alt}
            loading="lazy"
            decoding="async"
          />
        </Reveal>

        <Reveal index={1} className="gallery-grid__actions">
          <button
            type="button"
            className="btn btn-primary w-full sm:w-auto"
            onClick={open({ page: 0, openDoors: true })}
          >
            <BookOpen size={18} aria-hidden="true" />
            {copy.gallery.action}
          </button>
          <ul className="mt-6 grid max-w-md grid-cols-2 gap-3 lg:max-w-none">
            {invitation.pages.map((page, index) => (
              <li key={page.id} className="min-w-0">
                <button
                  type="button"
                  className="page-thumb w-full"
                  onClick={open({ page: index, openDoors: false })}
                >
                  <span className="page-thumb__image">
                    <img
                      src={page.preview}
                      width={page.width}
                      height={page.height}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  {page.label}
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {viewer && (
        <CardViewer
          initialPage={viewer.page}
          openDoors={viewer.openDoors}
          onClose={() => {
            setViewer(null);
            returnFocus.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </section>
  );
}
