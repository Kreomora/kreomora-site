import {buildStatic} from './build-static.mjs';

await buildStatic({
 directory:'.netlify-build',
 siteUrl:'https://kreomora.ru',
 dataFile:'data/portfolio.json',
});
