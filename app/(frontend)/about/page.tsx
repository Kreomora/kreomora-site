import {SiteLink} from '@/components/site-link';
import {ContactLink} from '@/components/contact-link';
import {Mascot} from '@/components/mascot';
import {getLocale, localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';

const copy = {
 ru: {
  hero: 'СОЗДАЁМ ВИЗУАЛЬНЫЕ ИСТОРИИ С ПОМОЩЬЮ AI.',
  subtitle: 'От коммерческих роликов и бренд-визуалов до персональных фильмов, событий и воспоминаний.',
  intro: 'KREOMORA — креативная студия. Мы превращаем идеи в визуальные проекты, сочетая AI с режиссурой, анимацией и монтажом.',
  worlds: 'Мы создаём коммерческие визуальные проекты для брендов и персональные фильмы о людях, событиях и воспоминаниях.',
  directions: 'Два направления',
  studio: 'Коммерческие ролики, AI-видео, motion, бренд-визуалы и визуализация продуктов. Создаём контент для соцсетей, событий и нестандартных креативных задач.',
  multstory: 'Персональные визуальные фильмы и истории о людях, отношениях, событиях и воспоминаниях.',
  enterStudio: 'Перейти в STUDIO',
  enterMultstory: 'Перейти в MULTSTORY',
  aiLabel: 'Как мы используем AI',
  aiTitle: 'AI расширяет визуальные возможности. Идея определяет результат.',
  aiText: 'AI — часть нашего производства. С его помощью мы создаём и трансформируем сцены, персонажей, окружение, движение и стилистику. Режиссура, анимация и монтаж помогают собрать эти элементы в цельную историю.',
  approach: 'Наш подход',
  approachTitle: 'Начинаем с идеи.',
  approachText: 'Сначала определяем задачу, идею и настроение. Затем выбираем визуальный стиль и способ производства: где уместен AI, где нужна анимация и как выстроить монтаж.',
  ctaTitle: 'Есть идея? Расскажите.',
  ctaText: 'Разберём задачу, подберём возможный визуальный подход и скажем, сможем ли её реализовать.',
  cta: 'Обсудить проект',
 },
 en: {
  hero: 'WE CREATE VISUAL STORIES WITH AI.',
  subtitle: 'From commercial films and brand visuals to personal stories, moments and memories.',
  intro: 'KREOMORA is a creative studio. We turn ideas into visual projects by combining AI with creative direction, animation and editing.',
  worlds: 'We make commercial work for brands and personal films about people, events and memories.',
  directions: 'Two directions',
  studio: 'Commercial films, AI video, motion design, brand and product visuals. We create work for social channels, events and briefs that call for an original approach.',
  multstory: 'Personal films and visual stories about people, relationships, events and memories.',
  enterStudio: 'Explore STUDIO',
  enterMultstory: 'Explore MULTSTORY',
  aiLabel: 'How we use AI',
  aiTitle: 'AI expands what we can show. The idea shapes what we make.',
  aiText: 'AI is part of our production process. We use it to build and transform scenes, characters, environments, movement and visual styles. Direction, animation and editing bring those elements together as a story.',
  approach: 'Our approach',
  approachTitle: 'We start with an idea.',
  approachText: 'We begin by defining the brief, the idea and the mood. Then we choose the visual style and decide where AI, motion design and traditional editing fit.',
  ctaTitle: 'Have an idea? Tell us about it.',
  ctaText: 'We’ll look at the brief, suggest a visual direction and let you know if we can bring it to life.',
  cta: 'Discuss a project',
 },
};

export async function generateMetadata() {
 const locale = await getLocale();
 return localizedMetadata(`${dictionaries[locale].aboutLink} — KREOMORA`, copy[locale].subtitle);
}

export default async function About() {
 const locale = await getLocale();
 const d = copy[locale];

 return <div className="about-editorial">
  <section className="wrap about-editorial-hero">
   <span className="eyebrow">KREOMORA</span>
   <h1>{d.hero}</h1>
   <p>{d.subtitle}</p>
  </section>

  <section className="wrap about-editorial-note" aria-labelledby="about-intro">
   <h2 id="about-intro" className="eyebrow">{locale === 'ru' ? 'О студии' : 'About the studio'}</h2>
   <div><p>{d.intro}</p><p>{d.worlds}</p></div>
  </section>

  <section className="wrap about-editorial-directions" aria-labelledby="about-directions">
   <h2 id="about-directions" className="eyebrow">{d.directions}</h2>
   <div className="about-editorial-split">
    <article>
     <SiteLink className="about-editorial-world" href={`/${locale}/studio/`}>
      <Mascot kind="studio" locale={locale}/>
      <div className="about-editorial-world-copy">
       <h3>KREOMORA <strong>STUDIO</strong></h3>
       <p>{d.studio}</p>
       <span className="text-link">{d.enterStudio} <span aria-hidden="true">↗</span></span>
      </div>
     </SiteLink>
    </article>
    <article>
     <SiteLink className="about-editorial-world about-editorial-warm" href={`/${locale}/multstory/`}>
      <Mascot kind="multstory" locale={locale}/>
      <div className="about-editorial-world-copy">
       <h3>KREOMORA <strong>MULTSTORY</strong></h3>
       <p>{d.multstory}</p>
       <span className="text-link">{d.enterMultstory} <span aria-hidden="true">↗</span></span>
      </div>
     </SiteLink>
    </article>
   </div>
  </section>

  <section className="wrap about-editorial-note about-editorial-ai" aria-labelledby="about-ai">
   <span className="eyebrow">{d.aiLabel}</span>
   <div><h2 id="about-ai">{d.aiTitle}</h2><p>{d.aiText}</p></div>
  </section>

  <section className="wrap about-editorial-note" aria-labelledby="about-approach">
   <span className="eyebrow">{d.approach}</span>
   <div><h2 id="about-approach">{d.approachTitle}</h2><p>{d.approachText}</p></div>
  </section>

  <section className="wrap about-editorial-contact" aria-labelledby="about-contact">
   <h2 id="about-contact">{d.ctaTitle}</h2>
   <p>{d.ctaText}</p>
   <ContactLink locale={locale}>{d.cta}</ContactLink>
  </section>
 </div>;
}
