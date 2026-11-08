import type {Metadata} from 'next';
import {MediaVideo} from '@/components/media';
import {Reel} from '@/components/interactive';
import {CTA,Projects,SectionTitle} from '@/components/sections';
import {projectsStudio} from '@/data/projects';
import {capabilities} from '@/data/site';
export const metadata:Metadata={title:'Studio — Commercial Imagination',alternates:{canonical:'/studio'}};
export default function Studio(){return <div className="dark"><section className="division-hero"><MediaVideo poster="/media/home/studio.svg" priority/><div className="division-title wrap"><span className="eyebrow">KREOMORA / COMMERCIAL IMAGINATION</span><h1>STUDIO</h1><div className="division-bottom"><h2>AI CREATIVE STUDIO<br/>FOR BRANDS, MOTION<br/>& VISUAL CAMPAIGNS.</h2><Reel poster={projectsStudio[0].cover}/></div></div><span className="hero-scroll">CONCEPT. VISUAL. MOTION. CAMPAIGN. <span>SCROLL ↓</span></span></section><section className="wrap selected"><SectionTitle label="2026 / PROJECT INDEX" title="SELECTED WORK" href="/studio/work" link="ALL PROJECTS"/><Projects projects={projectsStudio}/></section><section className="wrap capabilities"><SectionTitle label="CAPABILITIES" title="WHAT WE DO"/>{capabilities.map(([title,description],i)=><div className="capability reveal" key={title}><small>0{i+1}</small><h3>{title}</h3><p>{description}</p><span>↗</span></div>)}</section><CTA/></div>;}
