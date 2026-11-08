export type Project = {slug:string;title:string;subtitle:string;year:number;category:string[];services:string[];cover:string;coverVideo?:string;heroVideo?:string;theme:'studio'|'multstory';description:string;gallery:string[];credits:string[];nextProject:string;assetRoot:string;placeholder:boolean};
const studioSeeds = [
 ['klyro-one','KLYRO ONE','Product Film','Commercial,Motion','A premium wireless audio campaign built around focus, movement and everyday immersion.'],
 ['smachno','СМАЧНО!','Food & Feeling','Commercial,Social,Motion','A playful food-delivery brand world spanning product films, character-driven advertising and social campaigns.'],
 ['noir-void','NOIR//VOID','After Dark','Branding,Social','A fictional nightlife identity exploring fashion, club culture and experimental poster systems.'],
 ['galchino-fc','GALCHINO FC','A Different Game','Sport,Social','A football visual campaign built around stylized athlete characters and social-first sports graphics.'],
 ['style-lab','STYLE LAB','Beyond the Expected','Experimental,Motion','Experiments across anime, clay, knitted worlds, game cinematics, fantasy and stylized realism.']
];
const storySeeds = [
 ['random-ride','A Random Ride','Love Story','Personal Story','A chance meeting. An ordinary journey. The beginning of a world that belongs to two people.'],
 ['two-of-us','Two of Us','Personal Animation','Personal Story','The small rituals, familiar places and quiet moments that make a life together.'],
 ['winter-memory','Winter Memory','Memory Film','Personal Story','Some seasons stay with us. A warm memory, brought back to life in a world of winter.'],
 ['our-first-trip','Our First Trip','Travel Story','Personal Story','A new place, a shared map, and the feeling that the journey has only just begun.'],
 ['for-mom','For Mom','Personal Gift','Personal Story','For the person who made the everyday extraordinary. A little film with a lifetime inside.']
];
function create(seeds:string[][],theme:Project['theme']):Project[]{return seeds.map((s,i)=>{const root=`/media/${theme}/${s[0]}`;return {slug:s[0],title:s[1],subtitle:s[2],year:2026,category:s[3].split(','),services:theme==='studio'?['Creative Direction','Visual Development','Motion']:['Story Development','Art Direction','Animation'],cover:`${root}/cover.svg`,theme,description:s[4],gallery:[`${root}/frame-01.svg`,`${root}/frame-02.svg`],credits:[],nextProject:seeds[(i+1)%seeds.length][0],assetRoot:root,placeholder:true};});}
export const projectsStudio=create(studioSeeds,'studio');
export const projectsMultstory=create(storySeeds,'multstory');
export const allProjects=[...projectsStudio,...projectsMultstory];
