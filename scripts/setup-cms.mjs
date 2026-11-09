import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
mkdirSync('storage/media',{recursive:true});
if(!existsSync('.env')){writeFileSync('.env',`PAYLOAD_SECRET=${randomBytes(48).toString('hex')}\nDATABASE_URL=file:./storage/kreomora.db\nMEDIA_DIR=storage/media\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\n`,{mode:0o600});console.log('Created local .env and storage. No credentials printed.');}else console.log('Existing .env preserved.');
