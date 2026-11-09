import Image from 'next/image';
import {dictionaries,Locale} from '@/data/translations';
type Kind='home'|'studio'|'multstory'|'portrait'|'transparent';
const files={home:'mascot-home-hero.webp',studio:'mascot-studio.webp',multstory:'mascot-multstory.webp',portrait:'mascot-portrait.webp',transparent:'mascot-transparent.png'};
export function Mascot({kind,locale,className=''}:{kind:Kind;locale:Locale;className?:string}){const portrait=kind==='portrait'||kind==='transparent';return <Image className={`mascot-image mascot-${kind} ${className}`} src={`/brand/mascot/${files[kind]}`} alt={dictionaries[locale].mascotAlt[kind]} width={portrait?1122:1672} height={portrait?1402:941} sizes={portrait?'(max-width: 700px) 90vw, 35vw':'(max-width: 700px) 100vw, 90vw'} loading="lazy"/>;}
