import {buildStatic} from './build-static.mjs';

await buildStatic({
 directory:'.pages-build',
 prefix:'/kreomora-site',
 siteUrl:'https://kreomora.github.io/kreomora-site',
 dataFile:'data/pages-projects.json',
 pages:true,
});
