import {MediaVideo} from './media';
import {Mascot} from './mascot';
import {ContactLink} from './contact-link';
import type {Project, Section} from '@/data/projects';
import type {Locale} from '@/data/translations';

export function DivisionContact({locale, section}: {locale: Locale; section: Section}) {
  return <ContactLink locale={locale} type={section}>
    {locale === 'ru' ? 'Связаться' : 'Contact us'}
  </ContactLink>;
}

export function DivisionHero({locale, section, intro, film}: {
  locale: Locale; section: Section; intro: string; film?: Project;
}) {
  return <section className="division-cinema">
    {film && <MediaVideo poster={film.cover} src={film.coverVideo} autoplay muted loop playsInline priority/>}
    <div className="wrap division-overview">
      <h1>{section.toUpperCase()}</h1>
      <p>{intro}</p>
      <div className="division-cinema-actions">
        <a className="ux-button" href="#portfolio">
          {locale === 'ru' ? 'Посмотреть работы' : 'View portfolio'}
        </a>
        <DivisionContact locale={locale} section={section}/>
      </div>
    </div>
  </section>;
}

export function DivisionScene({locale, section, children}: {
  locale: Locale; section: Section; children: React.ReactNode;
}) {
  return <div className="division-scene">
    <div className="division-scene-art" aria-hidden="true"><Mascot locale={locale} kind={section}/></div>
    {children}
  </div>;
}
