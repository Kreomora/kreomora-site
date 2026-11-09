'use client';
import Image from 'next/image';
import {useLocale} from './locale';
import {useEffect,useRef} from 'react';
type Props={src?:string;poster:string;alt?:string;autoplay?:boolean;loop?:boolean;muted?:boolean;playsInline?:boolean;controls?:boolean;preload?:'none'|'metadata'|'auto';priority?:boolean;hover?:boolean;objectFit?:'cover'|'contain'};
export function PortfolioVideo({src,poster,alt='',autoplay=true,loop=true,muted=true,playsInline=true,controls=false,preload='none',priority=false,hover=false,objectFit='cover'}:Props){
 const {d}=useLocale();
 const container=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const el=video.current,box=container.current;if(!el||!box||!src)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  let visible=false,hovered=false;
  const update=()=>{const play=visible&&!document.hidden&&!reduced.matches&&autoplay&&(!hover||(fine.matches&&hovered));if(play){if(!el.getAttribute('src'))el.src=src;void el.play().catch(()=>{});}else if(!controls||!visible||document.hidden)el.pause();};
  const enter=()=>{hovered=true;update();},leave=()=>{hovered=false;update();};
  const target=box.closest('a')||box;
  target.addEventListener('mouseenter',enter);target.addEventListener('mouseleave',leave);target.addEventListener('focus',enter);target.addEventListener('blur',leave);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();},{threshold:.15});observer.observe(box);
  document.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);
  return()=>{observer.disconnect();target.removeEventListener('mouseenter',enter);target.removeEventListener('mouseleave',leave);target.removeEventListener('focus',enter);target.removeEventListener('blur',leave);document.removeEventListener('visibilitychange',update);reduced.removeEventListener('change',update);el.pause();};
 },[src,autoplay,hover,controls]);
 return <div ref={container} className="media"><Image src={poster} alt={alt} fill sizes="(max-width: 700px) 100vw, 85vw" priority={priority} style={{objectFit}}/>{src&&<video ref={video} src={src} poster={poster} muted={muted} loop={loop} playsInline={playsInline} controls={controls} preload={priority?'metadata':preload} aria-label={alt||d.film} style={{objectFit}}/>}</div>;
}
export const MediaVideo=PortfolioVideo;
