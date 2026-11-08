import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,MotionSetup} from '@/components/interactive';
import {navigation,site,socialLinks} from '@/data/site';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(site.url),title:{default:'KREOMORA — AI Creative Studio & Personal Visual Stories',template:'%s — KREOMORA'},description:site.description,alternates:{canonical:'/'},openGraph:{title:'KREOMORA — Two worlds. One creative language.',description:site.description,images:['/og.svg'],type:'website'},twitter:{card:'summary_large_image',images:['/og.svg']},icons:{icon:'/icon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><footer className="wrap"><div className="footer-top"><Link className="wordmark" href="/">KREOMORA®</Link><p>CREATE.<br/>MOVE.<br/>REMEMBER.</p><div>{navigation.map(n=><Link key={n.href} href={n.href}>{n.label}</Link>)}</div><div>{socialLinks.map(s=><span key={s.label} aria-label={`${s.label} — coming soon`}>{s.label} ↗</span>)}</div></div><div className="footer-bottom"><span>© 2026 KREOMORA</span><span>PERSONAL STORIES. COMMERCIAL IMAGINATION.</span><a href="#main">BACK TO TOP ↑</a></div></footer><MotionSetup/></body></html>;}
