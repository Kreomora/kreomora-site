'use client';
import Link from 'next/link';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import type {Project} from '@/data/projects';
import {MediaVideo} from './media';
import {LanguageSwitcher,useLocale} from './locale';
import {ContactLink} from './contact-link';
export function Header(){
 const pathname=usePathname(),{d,href,locale}=useLocale();const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false);const toggle=useRef<HTMLButtonElement>(null),menu=useRef<HTMLDivElement>(null);
 useEffect(()=>{const fn=()=>setScrolled(window.scrollY>40);const resize=()=>{if(innerWidth>700)setOpen(false);};fn();window.addEventListener('scroll',fn,{passive:true});window.addEventListener('resize',resize);return()=>{window.removeEventListener('scroll',fn);window.removeEventListener('resize',resize);};},[]);
 useEffect(()=>{if(!open)return;document.body.style.overflow='hidden';const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus();}if(e.key==='Tab'){const items=[toggle.current,...Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>('a')||[])].filter(Boolean) as HTMLElement[];const index=items.indexOf(document.activeElement as HTMLElement);if(e.shiftKey&&index===0){e.preventDefault();items.at(-1)?.focus();}else if(!e.shiftKey&&index===items.length-1){e.preventDefault();items[0]?.focus();}}};menu.current?.querySelector('a')?.focus();document.addEventListener('keydown',key);return()=>{document.body.style.overflow='';document.removeEventListener('keydown',key);};},[open]);
 return <header className={`${scrolled?'scrolled':''} ${pathname.includes('/multstory')?'warm-header':''} ${open?'menu-open':''}`}><Link className="wordmark" href={href('/')} onClick={()=>setOpen(false)}><Image src="/brand/kreomora-logo-light.png" alt="KREOMORA" width={92} height={92} priority/></Link><nav aria-label={locale==='ru'?'Основная навигация':'Main navigation'}>{d.nav.map(n=><Link aria-current={pathname.includes(n.path)?'page':undefined} key={n.path} className={n.path==='/contact'?'header-contact':undefined} href={href(n.path)}>{n.path==='/contact'?d.contact.header:n.label}</Link>)}</nav><div className="desktop-language"><LanguageSwitcher/></div><button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)}>{open?`${d.close} −`:`${d.menu} +`}</button>{open&&<div ref={menu} id="mobile-menu" className="mobile-menu">{d.nav.map((n,i)=><Link key={n.path} href={href(n.path)} onClick={()=>setOpen(false)}><small>0{i+1}</small>{n.label} ↗</Link>)}<LanguageSwitcher/><ContactLink locale={locale}/></div>}</header>;
}
export function MotionSetup(){
 const path=usePathname();
 useEffect(()=>{
  const main=document.querySelector('main');
  if(!main)return;
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
   }
  },{threshold:.08});
  const scan=()=>main.querySelectorAll('.reveal:not(.visible)').forEach(element=>observer.observe(element));
  scan();
  const changes=new MutationObserver(scan);
  changes.observe(main,{childList:true,subtree:true});
  return()=>{changes.disconnect();observer.disconnect();};
 },[path]);
 return null;
}
export function ProjectCard({project:p,index=0}:{project:Project;index?:number}){const {d,href}=useLocale();return <Link className={`project-card project-${index%5}`} href={href(`/${p.section}/${p.slug}`)}><div className="project-image"><MediaVideo poster={p.cover} src={p.coverVideo} alt={p.coverAlt} objectFit="contain" hover/><span className="view-label">{p.section==='studio'?d.view:d.viewStory} ↗</span></div><div className="project-caption"><h3>{p.title}</h3><span>{p.subtitle}</span><small>{p.year} ↗</small></div></Link>;}
export function Archive({projects}:{projects:Project[]}){const {d}=useLocale();const [filter,setFilter]=useState('');const filters=['',...new Set(projects.flatMap(p=>p.category))];return <>{projects[0]?.section==='studio'&&<div className="filters" aria-label={d.filter}>{filters.map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f||d.all}<sup>{!f?projects.length:projects.filter(p=>p.category.includes(f)).length}</sup></button>)}</div>}<div aria-live="polite" className="project-grid filtered" key={filter}>{projects.filter(p=>!filter||p.category.includes(filter)).map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div></>;}
export function Reel({src,poster}:{src?:string;poster:string}){const {d}=useLocale();const dialog=useRef<HTMLDialogElement>(null);return <><button className="text-link" onClick={()=>{const modal=dialog.current;modal?.showModal();const film=modal?.querySelector('video');if(film&&src&&!film.getAttribute('src'))film.src=src;}}>{d.play} <span>↗</span></button><dialog ref={dialog} className="reel-dialog" aria-label={d.film} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} onClose={()=>dialog.current?.querySelector('video')?.pause()}><button className="close-reel" autoFocus onClick={()=>dialog.current?.close()}>{d.close} ×</button><div className="reel-screen">{src?<video poster={poster} controls preload="none" playsInline/>:<p>{d.unavailable}</p>}</div></dialog></>;}
export function StoryExplorer({styles=false,projects=[]}:{styles?:boolean;projects?:Project[]}){
 const {d,locale,href}=useLocale(),items=styles?d.styles:d.types;const [active,setActive]=useState(0);
 const slugs=styles?['3d-story','cinematic-realism','knitted-story','clay-story','2d-animation','anime-story','brick-world']:['love-story','the-proposal','family-story',null,'child-story','gender-reveal',null,null];
 const project=projects.find(p=>p.slug===slugs[active]);
 return <div className="explorer"><div className="explorer-list">{items.map((item,i)=><button key={item} onPointerEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} aria-pressed={active===i}><small>{String(i+1).padStart(2,'0')}</small>{item}<span>↗</span></button>)}</div><div className="explorer-art" key={active}>{project?<><MediaVideo poster={project.cover} alt={project.title}/><Link className="explorer-cta" href={href(`/multstory/${project.slug}`)}>{d.viewStory} ↗</Link></>:<><Image src="/brand/mascot/mascot-multstory.webp" alt={d.mascotAlt.multstory} fill sizes="(max-width:700px) 100vw, 45vw" style={{objectFit:'cover',objectPosition:'25% center'}}/><div className="explorer-cta"><ContactLink type="multstory" locale={locale}/></div></>}</div></div>;
}
