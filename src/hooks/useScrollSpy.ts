import { useEffect, useState } from 'react';

/** Reports which section currently crosses the middle of the screen. */
export function useScrollSpy(ids: readonly string[]): string {
  const [activeId, setActiveId] = useState<string>(ids[0]);
  const [atEnd, setAtEnd] = useState(false);
  const lastId = ids[ids.length - 1];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    // The last section can be too short to ever reach the middle of the screen,
    // so it also counts as current once it is mostly in view.
    const endObserver = new IntersectionObserver(([entry]) => setAtEnd(entry.isIntersecting), {
      threshold: 0.6,
    });
    const last = document.getElementById(lastId);
    if (last) endObserver.observe(last);

    return () => {
      observer.disconnect();
      endObserver.disconnect();
    };
  }, [ids, lastId]);

  return atEnd ? lastId : activeId;
}
