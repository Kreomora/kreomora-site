'use client';
import Image from 'next/image';
import {useLocale} from './locale';
import {useEffect,useRef} from 'react';
type Props={src?:string;poster:string;alt?:string;autoplay?:boolean;loop?:boolean;muted?:boolean;playsInline?:boolean;controls?:boolean;preload?:'none'|'metadata'|'auto';priority?:boolean;hover?:boolean;objectFit?:'cover'|'contain'};
export function PortfolioVideo({src,poster,alt='',autoplay=true,loop=true,muted=true,playsInline=true,controls=false,preload='none',priority=false,hover=false,objectFit='cover'}:Props){
 const {d}=useLocale();
 const container=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const el=video.current,box=container.current;
  if(!el||!box||!src)return;
  const showFrame=()=>{el.dataset.ready="true";};
  if(el.readyState>=2)showFrame();
  el.addEventListener("loadeddata",showFrame);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const target:HTMLElement=box.closest('a')||box;
  let visible=false,near=false,pointer=false,focused=target.matches(':focus-visible');
  const load=()=>{if(!el.getAttribute('src'))el.src=src;};
  const update=()=>{
   const intent=pointer||focused;
   const canAnimate=autoplay&&!reduced.matches&&!document.hidden;
   if((controls&&near)|| (canAnimate&&(hover?intent:near)))load();
   if(canAnimate&&visible&&(!hover||intent)){
    load();
    void el.play().catch(()=>{});
   }else if(!controls||!visible||document.hidden)el.pause();
  };
  const enter=(event:PointerEvent)=>{pointer=event.pointerType!=='touch';update();};
  const leave=()=>{pointer=false;update();};
  const focus=()=>{focused=target.matches(':focus-visible');update();};
  const blur=()=>{focused=false;update();};
  const viewport=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();},{threshold:.01});
  const proximity=new IntersectionObserver(([entry])=>{near=entry.isIntersecting;update();},{rootMargin:'400px'});
  viewport.observe(box);
  if(!hover&&!priority)proximity.observe(box);
  if(hover){
   target.addEventListener('pointerenter',enter);
   target.addEventListener('pointerleave',leave);
   target.addEventListener('focus',focus);
   target.addEventListener('blur',blur);
  }
  document.addEventListener('visibilitychange',update);
  reduced.addEventListener('change',update);
  return()=>{
   viewport.disconnect();
   proximity.disconnect();
   target.removeEventListener('pointerenter',enter);
   target.removeEventListener('pointerleave',leave);
   target.removeEventListener('focus',focus);
   target.removeEventListener('blur',blur);
   document.removeEventListener('visibilitychange',update);
   reduced.removeEventListener('change',update);
   el.removeEventListener("loadeddata",showFrame);
   delete el.dataset.ready;
   el.pause();
   if(!priority){el.removeAttribute('src');el.load();}
  };
 },[src,autoplay,hover,controls,priority]);
 return <div ref={container} className="media">
  <Image src={poster} alt={alt} fill sizes="(max-width: 700px) 100vw, 85vw" priority={priority} style={{objectFit}}/>
  {src&&<video ref={video} src={priority?src:undefined} poster={poster} muted={muted} loop={loop}
   playsInline={playsInline} controls={controls} preload={priority?'metadata':preload}
   aria-label={alt||d.film} style={{objectFit}}/>}
 </div>;
}
export const MediaVideo=PortfolioVideo;
