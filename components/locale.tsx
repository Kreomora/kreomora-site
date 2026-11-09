'use client';
import {createContext,useContext} from 'react';
import {usePathname} from 'next/navigation';
import {dictionaries,Locale} from '@/data/translations';
const LocaleContext=createContext<Locale>('ru');
export function LocaleProvider({locale,children}:{locale:Locale;children:React.ReactNode}){return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;}
export function useLocale(){const locale=useContext(LocaleContext);return {locale,d:dictionaries[locale],href:(path:string)=>`/${locale}${path==='/'?'/':path}`};}
export function LanguageSwitcher(){const {locale,d}=useLocale();const pathname=usePathname();const path=pathname.replace(/^\/(ru|en)(?=\/|$)/,'')||'/';return <div className="language-switch" role="group" aria-label={d.language}>{(['ru','en'] as const).map(l=><a key={l} href={`/${l}${path}`} lang={l} hrefLang={l} aria-label={l==='ru'?'Переключить на русский':'Switch to English'} aria-current={l===locale?'true':undefined}>{l.toUpperCase()}</a>)}</div>;}
