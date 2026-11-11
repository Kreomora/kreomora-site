import {contact} from './contact';
export const site = { name: 'KREOMORA', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kreomora.ru', description: 'KREOMORA creates AI-powered commercials, motion campaigns and personal visual stories through KREOMORA STUDIO and MULTSTORY.' };
export const navigation = [{label:'STUDIO',href:'/studio'},{label:'MULTSTORY',href:'/multstory'},{label:'ABOUT',href:'/about'},{label:'CONTACT',href:'/contact'}];
// TODO: Replace with verified brand accounts before enabling social links.

export const capabilities = [['AI Creative Direction','Concepts, campaigns and visual development.'],['AI Commercials','Product films and branded advertising.'],['Motion Design','Campaign animation and cinematic motion.'],['Social Campaigns','Static and animated social systems.'],['Brand Worlds','Mascots, identities and campaign universes.'],['Visual Development','Experimental style exploration and production concepts.']];
export const storyServices = ['Animated Love Stories','Family Stories','Birthday Films','Memory Films','Travel Stories','Personal Gifts'];
export const visualStyles = ['3D Animation','Anime','Clay','Knitted','Cinematic','Illustration','Game-inspired','Fantasy'];

// Add only verified studio contact details. Empty values never render fake links.
export const siteConfig={contact};
