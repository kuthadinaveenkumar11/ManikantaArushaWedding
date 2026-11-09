import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { m, useMotionValue, useReducedMotion } from 'framer-motion';
import type { InvitationPage } from '../config/weddingConfig';

export interface ZoomHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  panBy: (dx: number, dy: number) => void;
}

export type ZoomLevel = 'min' | 'mid' | 'max';

interface ZoomableImageProps {
  ref?: Ref<ZoomHandle>;
  page: InvitationPage;
  canGoPrev: boolean;
  canGoNext: boolean;
  onSwipe: (direction: 1 | -1) => void;
  onLevelChange: (level: ZoomLevel) => void;
}

interface Gesture {
  mode: 'none' | 'swipe' | 'pan' | 'pinch';
  startX: number;
  startY: number;
  startTime: number;
  originX: number;
  originY: number;
  startDistance: number;
  startScale: number;
  moved: boolean;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const STEP = 0.75;
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;
const SETTLE_MS = 240;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Shows one photograph with pinch, wheel, double-tap and button zoom, drag to pan,
 * and swipe to turn the page. It appears right away from the light copy, then
 * switches to the unchanged original once that has loaded, so zooming stays sharp.
 * Zoom is a transform on the image, so nothing is ever cropped from the file.
 */
export function ZoomableImage({
  ref,
  page,
  canGoPrev,
  canGoNext,
  onSwipe,
  onLevelChange,
}: ZoomableImageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();
  const [source, setSource] = useState(page.preview);

  useEffect(() => {
    let cancelled = false;
    const original = new Image();
    original.src = page.src;
    original
      .decode()
      .then(() => {
        if (!cancelled) setSource(page.src);
      })
      // On a failed download the guest simply keeps the light copy.
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [page.src]);

  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const settleFrame = useRef<number | undefined>(undefined);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const lastTap = useRef({ time: 0, x: 0, y: 0 });
  const lastLevel = useRef<ZoomLevel>('min');
  const gesture = useRef<Gesture>({
    mode: 'none',
    startX: 0,
    startY: 0,
    startTime: 0,
    originX: 0,
    originY: 0,
    startDistance: 1,
    startScale: 1,
    moved: false,
  });

  const reportLevel = useCallback(
    (value: number) => {
      const level: ZoomLevel =
        value <= MIN_SCALE + 0.01 ? 'min' : value >= MAX_SCALE - 0.01 ? 'max' : 'mid';
      if (level !== lastLevel.current) {
        lastLevel.current = level;
        onLevelChange(level);
      }
    },
    [onLevelChange],
  );

  /** Keeps a zoomed image covering the stage, and centres it when it fits. */
  const clampPan = useCallback((nextX: number, nextY: number, nextScale: number) => {
    const stage = stageRef.current;
    const image = imageRef.current;
    if (!stage || !image) return { x: 0, y: 0 };
    const maxX = Math.max(0, (image.offsetWidth * nextScale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (image.offsetHeight * nextScale - stage.clientHeight) / 2);
    return { x: clamp(nextX, -maxX, maxX), y: clamp(nextY, -maxY, maxY) };
  }, []);

  const stopSettling = useCallback(() => {
    if (settleFrame.current !== undefined) cancelAnimationFrame(settleFrame.current);
    settleFrame.current = undefined;
  }, []);

  useEffect(() => stopSettling, [stopSettling]);

  const moveTo = useCallback(
    (nextScale: number, nextX: number, nextY: number, smooth: boolean) => {
      const position = clampPan(nextX, nextY, nextScale);
      reportLevel(nextScale);
      stopSettling();
      if (!smooth || reduced) {
        scale.set(nextScale);
        x.set(position.x);
        y.set(position.y);
        return;
      }
      const from = { scale: scale.get(), x: x.get(), y: y.get() };
      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / SETTLE_MS);
        const eased = 1 - (1 - progress) ** 3;
        scale.set(from.scale + (nextScale - from.scale) * eased);
        x.set(from.x + (position.x - from.x) * eased);
        y.set(from.y + (position.y - from.y) * eased);
        settleFrame.current = progress < 1 ? requestAnimationFrame(step) : undefined;
      };
      settleFrame.current = requestAnimationFrame(step);
    },
    [clampPan, reduced, reportLevel, scale, stopSettling, x, y],
  );

  /** Zooms while keeping the point under the finger or cursor in place. */
  const zoomAt = useCallback(
    (target: number, clientX: number | null, clientY: number | null, smooth: boolean) => {
      const stage = stageRef.current;
      if (!stage) return;
      const nextScale = clamp(target, MIN_SCALE, MAX_SCALE);
      const current = scale.get();
      const rect = stage.getBoundingClientRect();
      const offsetX = clientX === null ? 0 : clientX - rect.left - rect.width / 2;
      const offsetY = clientY === null ? 0 : clientY - rect.top - rect.height / 2;
      const ratio = nextScale / current;
      moveTo(
        nextScale,
        offsetX - (offsetX - x.get()) * ratio,
        offsetY - (offsetY - y.get()) * ratio,
        smooth,
      );
    },
    [moveTo, scale, x, y],
  );

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => zoomAt(scale.get() + STEP, null, null, true),
      zoomOut: () => zoomAt(scale.get() - STEP, null, null, true),
      reset: () => moveTo(MIN_SCALE, 0, 0, true),
      panBy: (dx, dy) => moveTo(scale.get(), x.get() + dx, y.get() + dy, true),
    }),
    [moveTo, scale, x, y, zoomAt],
  );

  // Registered directly because React's wheel listener cannot cancel page zoom.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const speed = event.ctrlKey ? 0.01 : 0.002;
      zoomAt(scale.get() * Math.exp(-event.deltaY * speed), event.clientX, event.clientY, false);
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [scale, zoomAt]);

  const beginPinch = () => {
    const [first, second] = [...pointers.current.values()];
    Object.assign(gesture.current, {
      mode: 'pinch',
      startDistance: Math.max(1, Math.hypot(first.x - second.x, first.y - second.y)),
      startScale: scale.get(),
      moved: true,
    });
  };

  const beginDrag = (clientX: number, clientY: number, timeStamp: number) => {
    Object.assign(gesture.current, {
      mode: scale.get() > MIN_SCALE + 0.01 ? 'pan' : 'swipe',
      startX: clientX,
      startY: clientY,
      startTime: timeStamp,
      originX: x.get(),
      originY: y.get(),
      moved: false,
    });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    stopSettling();
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) beginPinch();
    else if (pointers.current.size === 1) beginDrag(event.clientX, event.clientY, event.timeStamp);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const state = gesture.current;

    if (state.mode === 'pinch' && pointers.current.size >= 2) {
      const [first, second] = [...pointers.current.values()];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      zoomAt(
        state.startScale * (distance / state.startDistance),
        (first.x + second.x) / 2,
        (first.y + second.y) / 2,
        false,
      );
      return;
    }

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (Math.hypot(dx, dy) > 8) state.moved = true;

    if (state.mode === 'pan') {
      moveTo(scale.get(), state.originX + dx, state.originY + dy, false);
    } else if (state.mode === 'swipe') {
      const blocked = (dx > 0 && !canGoPrev) || (dx < 0 && !canGoNext);
      x.set(blocked ? dx * 0.25 : dx);
    }
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    if (!pointers.current.delete(event.pointerId)) return;
    const state = gesture.current;

    if (state.mode === 'pinch') {
      const [remaining] = [...pointers.current.values()];
      if (remaining) {
        beginDrag(remaining.x, remaining.y, event.timeStamp);
        state.moved = true;
      } else {
        state.mode = 'none';
        if (scale.get() < MIN_SCALE + 0.05) moveTo(MIN_SCALE, 0, 0, true);
      }
      return;
    }
    if (pointers.current.size > 0) return;

    if (state.mode === 'swipe') {
      const dx = event.clientX - state.startX;
      const elapsed = Math.max(1, event.timeStamp - state.startTime);
      const stageWidth = stageRef.current?.clientWidth ?? 0;
      const farEnough = Math.abs(dx) > Math.min(stageWidth * 0.18, 120);
      const fastEnough = Math.abs(dx) > 24 && Math.abs(dx) / elapsed > 0.6;
      const direction: 1 | -1 = dx < 0 ? 1 : -1;
      const allowed = direction === 1 ? canGoNext : canGoPrev;

      if (!cancelled && state.moved && (farEnough || fastEnough) && allowed) {
        state.mode = 'none';
        onSwipe(direction);
        return;
      }
      if (state.moved) moveTo(MIN_SCALE, 0, 0, true);
    }

    if (!cancelled && !state.moved) {
      const tap = lastTap.current;
      const isDouble =
        event.timeStamp - tap.time < DOUBLE_TAP_MS &&
        Math.hypot(event.clientX - tap.x, event.clientY - tap.y) < 30;
      if (isDouble) {
        lastTap.current = { time: 0, x: 0, y: 0 };
        if (scale.get() > MIN_SCALE + 0.01) moveTo(MIN_SCALE, 0, 0, true);
        else zoomAt(DOUBLE_TAP_SCALE, event.clientX, event.clientY, true);
      } else {
        lastTap.current = { time: event.timeStamp, x: event.clientX, y: event.clientY };
      }
    }
    state.mode = 'none';
  };

  return (
    <div
      ref={stageRef}
      className="zoom-stage"
      style={{ '--page-ratio': `${page.width} / ${page.height}` } as React.CSSProperties}
      data-testid="zoom-stage"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => endPointer(event, false)}
      onPointerCancel={(event) => endPointer(event, true)}
    >
      <m.img
        ref={imageRef}
        src={source}
        width={page.width}
        height={page.height}
        alt={page.alt}
        draggable={false}
        style={{ x, y, scale }}
      />
    </div>
  );
}
