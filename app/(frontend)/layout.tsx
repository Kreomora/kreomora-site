import Link from 'next/link';
import {Header,MotionSetup} from '@/components/interactive';
import {LocaleProvider,LanguageSwitcher} from '@/components/locale';
import {ContactLink} from '@/components/contact-link';
import {CONTACT_EMAIL} from '@/lib/contact';
import {getLocale,localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';

import './globals.css';
export const dynamic='force-dynamic';
export async function generateMetadata(){return {...await localizedMetadata(),icons:{icon:'/brand/kreomora-logo-dark.png'}};}
export default async function RootLayout({children}:{children:React.ReactNode}){
 const locale=await getLocale(),d=dictionaries[locale];
 return <html lang={locale} data-scroll-behavior="smooth"><body><LocaleProvider locale={locale}><a className="skip-link" href="#main">{d.skip}</a><Header/><main id="main">{children}</main><footer className="wrap"><div className="footer-top"><Link className="wordmark" href={`/${locale}/`}>KREOMORA</Link><p>CREATE.<br/>MOVE.<br/>REMEMBER.</p><div>{d.nav.map(n=><Link key={n.path} href={`/${locale}${n.path}`}>{n.label}</Link>)}</div><div><LanguageSwitcher/><ContactLink locale={locale} className="footer-contact-link">Telegram</ContactLink><ContactLink locale={locale} channel="vk" className="footer-contact-link">VK</ContactLink><ContactLink locale={locale} channel="email" className="footer-contact-link">{CONTACT_EMAIL}</ContactLink></div></div><div className="mobile-footer-contact"><ContactLink locale={locale}/></div><div className="footer-bottom"><span>© 2026 KREOMORA</span><span>STUDIO / MULTSTORY</span><a href="#main">{d.top} ↑</a></div></footer><MotionSetup/></LocaleProvider></body></html>;
}
