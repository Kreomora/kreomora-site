import Link from 'next/link';
import {getLocale} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';
export default async function NotFound(){const locale=await getLocale(),d=dictionaries[locale];return <section className="wrap about-page"><span className="eyebrow">404 / {d.notFound}</span><h1 className="lines">{d.notFoundTitle}</h1><Link className="text-link" href={`/${locale}/`}>{d.home} ↗</Link></section>;}
