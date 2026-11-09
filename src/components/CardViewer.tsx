import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { ZoomableImage, type ZoomHandle, type ZoomLevel } from './ZoomableImage';

interface CardViewerProps {
  initialPage: number;
  /** Show the cover first, then swing its doors apart onto the inner invitation. */
  openDoors: boolean;
  onClose: () => void;
}

type DoorState = 'closed' | 'opening' | 'done';

const { pages, gateFold } = weddingConfig.invitation;
const COVER = pages[0];
const FIRST_INNER_PAGE = 1;

/** How long guests see the closed cover before it opens. */
const COVER_HOLD_MS = 1100;
/** The doors wait no longer than this for the inner photograph to be ready. */
const DECODE_LIMIT_MS = 1500;

function doorPolygon(side: 'left' | 'right'): string {
  const points = gateFold.seam.map(([px, py]) => `${px}% ${py}%`);
  return side === 'left'
    ? `polygon(0% 0%, ${points.join(', ')}, 0% 100%)`
    : `polygon(100% 0%, 100% 100%, ${[...points].reverse().join(', ')})`;
}

const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** A full-screen, modal view of the original invitation photographs. */
export function CardViewer({ initialPage, openDoors, onClose }: CardViewerProps) {
  const { gallery } = weddingConfig.copy;
  const reduced = useReducedMotion();
  const animateDoors = openDoors && !reduced;

  const dialogRef = useRef<HTMLDialogElement>(null);
  // One handle per page: while a page turns, the outgoing image unmounts after the
  // incoming one has mounted, and must not clear the handle of the page now showing.
  const zoomHandles = useRef(new Map<string, ZoomHandle>());
  const closeRef = useRef<HTMLButtonElement>(null);
  const [page, setPage] = useState(openDoors ? FIRST_INNER_PAGE : initialPage);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('min');
  const [doors, setDoors] = useState<DoorState>(animateDoors ? 'closed' : 'done');
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Hold the cover for a moment, with the inner photograph ready before the doors part.
  useEffect(() => {
    if (doors !== 'closed') return undefined;
    let cancelled = false;
    const inner = new Image();
    inner.src = pages[FIRST_INNER_PAGE].preview;
    const ready = Promise.race([
      inner.decode().catch(() => undefined),
      new Promise((resolve) => window.setTimeout(resolve, DECODE_LIMIT_MS)),
    ]);
    const hold = new Promise((resolve) => window.setTimeout(resolve, COVER_HOLD_MS));
    Promise.all([ready, hold]).then(() => {
      if (!cancelled) setDoors('opening');
    });
    return () => {
      cancelled = true;
    };
    // Runs once when the viewer opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= pages.length) return;
      setDirection(next > page ? 1 : -1);
      setZoomLevel('min');
      setPage(next);
    },
    [page],
  );

  const requestClose = useCallback(() => setClosing(true), []);

  const current = pages[page];
  const zoomControl = useCallback(() => zoomHandles.current.get(pages[page].id), [page]);
  const doorsVisible = doors !== 'done';
  // Until the doors have parted, what the guest is looking at is still the cover.
  const shownPage = doorsVisible ? 0 : page;

  // Listens on the document: a control that disables itself at the first or last
  // page drops focus out of the dialog, and the keys must keep working regardless.
  useEffect(() => {
    if (doors !== 'done') return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      const zoomed = zoomLevel !== 'min';
      switch (event.key) {
        case 'ArrowLeft':
          if (zoomed) zoomControl()?.panBy(80, 0);
          else goTo(page - 1);
          break;
        case 'ArrowRight':
          if (zoomed) zoomControl()?.panBy(-80, 0);
          else goTo(page + 1);
          break;
        case 'ArrowUp':
          if (zoomed) zoomControl()?.panBy(0, 80);
          break;
        case 'ArrowDown':
          if (zoomed) zoomControl()?.panBy(0, -80);
          break;
        case '+':
        case '=':
          zoomControl()?.zoomIn();
          break;
        case '-':
          zoomControl()?.zoomOut();
          break;
        case '0':
          zoomControl()?.reset();
          break;
        default:
          return;
      }
      event.preventDefault();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [doors, goTo, page, zoomControl, zoomLevel]);

  // Keep keyboard focus inside the dialog when the focused control becomes disabled.
  useEffect(() => {
    const active = document.activeElement;
    if (!active || active === document.body || (active as HTMLButtonElement).disabled) {
      closeRef.current?.focus();
    }
  }, [page, zoomLevel]);

  const doorTransition = { duration: 1.15, ease: [0.5, 0.05, 0.2, 1] as const };

  return (
    <dialog
      ref={dialogRef}
      className="card-viewer on-stone"
      aria-label="Original wedding invitation"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={onClose}
    >
      <m.div
        className="card-viewer__layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: closing ? 0.18 : 0.3 }}
        onAnimationComplete={() => {
          if (closing) dialogRef.current?.close();
        }}
      >
        <header className="flex items-center gap-3">
          <p
            className="min-w-0 flex-1 font-display text-title leading-tight font-semibold"
            aria-live="polite"
            data-testid="viewer-page-label"
          >
            {pages[shownPage].label}
          </p>
          <button ref={closeRef} type="button" className="btn btn-quiet" autoFocus onClick={requestClose}>
            <X size={18} aria-hidden="true" />
            {gallery.close}
          </button>
        </header>

        <div className="card-viewer__stage">
          {/* The inner spread is wider than the cover, so it only appears as the doors part. */}
          <m.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: doors === 'closed' ? 0 : 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <m.div
                key={current.id}
                className="card-slide"
                custom={direction}
                variants={{
                  enter: (dir: number) => ({ x: `${dir * 100}%`, opacity: 0 }),
                  center: { x: '0%', opacity: 1 },
                  leave: (dir: number) => ({ x: `${dir * -100}%`, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="leave"
                transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <ZoomableImage
                  ref={(handle) => {
                    if (handle) zoomHandles.current.set(current.id, handle);
                    else zoomHandles.current.delete(current.id);
                  }}
                  page={current}
                  canGoPrev={page > 0}
                  canGoNext={page < pages.length - 1}
                  onSwipe={(step) => goTo(page + step)}
                  onLevelChange={setZoomLevel}
                />
              </m.div>
            </AnimatePresence>
          </m.div>

          {doorsVisible && (
            <div
              className="gate-doors"
              style={{ '--page-ratio': `${COVER.width} / ${COVER.height}` } as React.CSSProperties}
              data-testid="gate-doors"
              aria-hidden="true"
            >
              <div className="gate-doors__box" data-state={doors}>
                <m.div
                  className="gate-door"
                  style={{
                    clipPath: doorPolygon('left'),
                    transformOrigin: `${gateFold.hingeLeftPercent}% 50%`,
                    transformPerspective: 1500,
                  }}
                  animate={doors === 'opening' ? { rotateY: -96 } : { rotateY: 0 }}
                  transition={doorTransition}
                  onAnimationComplete={() => {
                    if (doors === 'opening') setDoors('done');
                  }}
                >
                  <img src={COVER.preview} width={COVER.width} height={COVER.height} alt="" draggable={false} />
                </m.div>
                <m.div
                  className="gate-door"
                  style={{
                    clipPath: doorPolygon('right'),
                    transformOrigin: `${gateFold.hingeRightPercent}% 50%`,
                    transformPerspective: 1500,
                  }}
                  animate={doors === 'opening' ? { rotateY: 96 } : { rotateY: 0 }}
                  transition={doorTransition}
                >
                  <img src={COVER.preview} width={COVER.width} height={COVER.height} alt="" draggable={false} />
                </m.div>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="icon-btn"
              aria-label="Previous page"
              disabled={page === 0 || doorsVisible}
              onClick={() => goTo(page - 1)}
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Zoom out"
              disabled={zoomLevel === 'min' || doorsVisible}
              onClick={() => zoomControl()?.zoomOut()}
            >
              <ZoomOut size={20} aria-hidden="true" />
            </button>
            <p className="min-w-0 flex-1 text-center text-label leading-tight text-on-stone-2">
              Page {shownPage + 1} of {pages.length}
            </p>
            <button
              type="button"
              className="icon-btn"
              aria-label="Zoom in"
              disabled={zoomLevel === 'max' || doorsVisible}
              onClick={() => zoomControl()?.zoomIn()}
            >
              <ZoomIn size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Next page"
              disabled={page === pages.length - 1 || doorsVisible}
              onClick={() => goTo(page + 1)}
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>
          <p className="card-viewer__hint">{hasFinePointer() ? gallery.hintPointer : gallery.hintTouch}</p>
        </footer>
      </m.div>
    </dialog>
  );
}
