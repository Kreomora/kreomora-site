'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';

export function DivisionAccordion({items, label}: {
  items: {id: string; title: string; content: ReactNode}[];
  label: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const scrollTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const sync = () => setActive(window.location.hash === '#portfolio' ? 'portfolio' : null);
    sync();
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.clearTimeout(scrollTimer.current);
    };
  }, []);

  function toggle(id: string, button: HTMLButtonElement) {
    const opening = active !== id;
    window.clearTimeout(scrollTimer.current);
    setActive(opening ? id : null);

    if (id === 'portfolio' || window.location.hash === '#portfolio') {
      const url = new URL(window.location.href);
      url.hash = opening && id === 'portfolio' ? 'portfolio' : '';
      window.history.replaceState(null, '', url);
    }
    if (opening && window.matchMedia('(max-width: 700px)').matches) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // When switching sections, let the closing panel finish moving the heading.
      scrollTimer.current = window.setTimeout(() => {
        const top = button.getBoundingClientRect().top;
        if (top >= 90 && top <= window.innerHeight * .55) return;
        const offscreen = top < 0 || top >= window.innerHeight;
        button.scrollIntoView({block: 'start', behavior: reducedMotion || offscreen ? 'instant' : 'smooth'});
      }, active && !reducedMotion ? 250 : 0);
    }
  }

  return <section className="wrap division-accordion" aria-label={label}>
    {items.map(({id, title, content}) => {
      const expanded = active === id;
      return <div className="division-accordion-item" id={id} key={id}>
        <h2>
          <button type="button" id={`${id}-toggle`} aria-expanded={expanded}
            aria-controls={`${id}-panel`} onClick={event => toggle(id, event.currentTarget)}>
            {title}<span aria-hidden="true">{expanded ? '−' : '+'}</span>
          </button>
        </h2>
        <div className="division-accordion-panel" id={`${id}-panel`} role="region"
          aria-labelledby={`${id}-toggle`} inert={!expanded} aria-hidden={!expanded}>
          <div><div className="division-accordion-content">{content}</div></div>
        </div>
      </div>;
    })}
  </section>;
}
