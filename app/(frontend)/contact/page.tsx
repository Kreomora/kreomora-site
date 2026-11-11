import Link from 'next/link';
import {ContactLink} from '@/components/contact-link';
import {Mascot} from '@/components/mascot';
import {contact} from '@/data/contact';
import {getLocale,localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';
export async function generateMetadata(){const d=dictionaries[await getLocale()];return localizedMetadata(`${d.nav[3].label} — KREOMORA`,d.contactIntro.replaceAll("\n"," "));}
export default async function Contact(){const locale=await getLocale(),d=dictionaries[locale];return <section className="wrap contact-page"><span className="eyebrow">KREOMORA / {d.cta.general.title}</span><h1 className="lines">{d.contactHero}</h1><div className="contact-direct-layout"><div><p className="contact-intro lines">{d.contactIntro}</p><div className="contact-direction-links"><Link href={`/${locale}/studio`}>STUDIO →</Link><Link href={`/${locale}/multstory`}>MULTSTORY →</Link></div><div className="contact-stack"><ContactLink locale={locale}><span><strong>TELEGRAM</strong><small>@{contact.telegram.username}</small><em>{locale==='ru'?'НАПИСАТЬ':'MESSAGE'}</em></span></ContactLink><ContactLink locale={locale} channel="email"><span><strong>EMAIL</strong><small>{contact.email}</small><em>{locale==='ru'?'НАПИСАТЬ':'WRITE'}</em></span></ContactLink><ContactLink locale={locale} channel="vk"><span><strong>VK</strong><small>KREOMORA</small><em>{locale==='ru'?'ОТКРЫТЬ':'OPEN'}</em></span></ContactLink></div></div><Mascot kind="portrait" locale={locale}/></div></section>;}
