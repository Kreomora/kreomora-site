import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const base='C:/Users/khodo/Downloads',dest='public/brand/mascot';await fs.mkdir(dest,{recursive:true});
const files=[['Изображение ChatGPT 9 нояб. 2026 г., 12_55_46-1.png','mascot-transparent.png'],['Изображение ChatGPT 9 нояб. 2026 г., 12_55_47-2.png','mascot-home-hero.webp'],['Изображение ChatGPT 9 нояб. 2026 г., 12_55_50-3.png','mascot-studio.webp'],['Изображение ChatGPT 9 нояб. 2026 г., 12_55_52-4.png','mascot-multstory.webp'],['Изображение ChatGPT 9 нояб. 2026 г., 12_55_54-5.png','mascot-portrait.webp']];
for(const [source,name] of files){const input=path.join(base,source),output=path.join(dest,name);if(name.endsWith('.png'))await fs.copyFile(input,output);else await sharp(input).webp({quality:88}).toFile(output);const m=await sharp(output).metadata(),stats=await sharp(output).stats();console.log(JSON.stringify({name,width:m.width,height:m.height,alpha:m.hasAlpha,opaque:stats.isOpaque,size:(await fs.stat(output)).size}));}
