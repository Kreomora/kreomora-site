'use client';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
export function MediaVideo({src,poster,alt='',autoplay=true,muted=true,loop=true,playsInline=true,controls=false,objectFit='cover',priority=false}:{src?:string;poster:string;alt?:string;autoplay?:boolean;muted?:boolean;loop?:boolean;playsInline?:boolean;controls?:boolean;objectFit?:'cover'|'contain';priority?:boolean}){
 const ref=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setReady(true);if(!reduced&&autoplay)video.current?.play().catch(()=>{});}else video.current?.pause();},{rootMargin:'120px'});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[autoplay]);
 return <div ref={ref} className="media"><Image src={poster} alt={alt} fill sizes="(max-width: 700px) 100vw, 85vw" priority={priority} style={{objectFit}}/>{src&&ready&&!failed&&<video ref={video} src={src} poster={poster} autoPlay={autoplay && !matchMedia('(prefers-reduced-motion: reduce)').matches} muted={muted||autoplay} loop={loop} playsInline={playsInline} controls={controls} preload={priority?'auto':'metadata'} onError={()=>setFailed(true)} style={{objectFit}}/>}</div>;
}
