"""Read/copy original assets; generate real frames and lightweight silent previews."""
from pathlib import Path
import json, re, shutil, subprocess
import os

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\khodo\Downloads\kreomora portfolio')
FFMPEG = os.environ.get('FFMPEG_PATH') or shutil.which('ffmpeg') or r'C:\Users\khodo\AppData\Local\CapCut\Apps\8.1.1.3417\ffmpeg.exe'
names = [
 ('studio','студио_пати_посты','noir-void','NOIR//VOID — Nightlife Campaign','Motion / Social'),
 ('studio','студио_посты_смачно','smachno-social','СМАЧНО! — Social Campaign','Social Campaign'),
 ('studio','студио_рекламный_смачно','smachno-food','СМАЧНО! — Food Commercial','Food Commercial'),
 ('studio','студио_смачно_рекламный','smachno-delivery','СМАЧНО! — Delivery Campaign','Commercial'),
 ('studio','студио_пост_1','studio-experiment-01','STUDIO EXPERIMENT 01','Visual Experiment'),
 ('studio','студио_пост_2','studio-experiment-02','STUDIO EXPERIMENT 02','Visual Experiment'),
 *[('multstory',a,b,c,d) for a,b,c,d in [
 ('мульт_3д','3d-story','3D Story','3D Animation'),('мульт_реализм','cinematic-realism','Cinematic Realism','Cinematic'),
 ('мульт_вязанныйэ','knitted-story','Knitted Story','Knitted Animation'),('мульт_пластилин','clay-story','Clay Story','Clay Animation'),
 ('мульт_2д','2d-animation','2D Animation','2D Animation'),('мульт_анимэ','anime-story','Anime Story','Anime'),
 ('мульт_лего','brick-world','Brick World','Brick Animation'),('мульт_гендер_пати','gender-reveal','Gender Reveal Story','Personal Film'),
 ('мульт_для_ребёнка','child-story','A Story for a Child','Personal Film'),('мульт_про_семью','family-story','Family Story','Personal Film'),
 ('мульт_про_отношения','love-story','Love Story','Personal Film'),('мульт_предложение','the-proposal','The Proposal','Personal Film')]]
]
files = list(SOURCE.rglob('*'))
rows=[]
for section,original,slug,title,category in names:
 source=next((p for p in files if p.is_file() and p.stem==original and p.suffix.lower() in ['.mp4','.mov','.webm','.m4v','.jpg','.jpeg','.png','.webp']),None)
 if not source: raise RuntimeError('Missing '+original)
 dest=ROOT/'public'/'portfolio'/section/(slug+source.suffix.lower())
 dest.parent.mkdir(parents=True,exist_ok=True)
 if not dest.exists(): shutil.copy2(source,dest)
 info=subprocess.run([FFMPEG,'-i',str(source)],capture_output=True,text=True).stderr
 duration=re.search(r'Duration: (\d+):(\d+):([\d.]+)',info)
 seconds=sum(float(v)*m for v,m in zip(duration.groups(),[3600,60,1])) if duration else 0
 resolution=re.search(r'Video:.*? (\d{2,5}x\d{2,5})',info)
 row=dict(section=section,originalFilename=source.name,slug=slug,title=title,category=category,size=source.stat().st_size,duration=seconds,resolution=resolution.group(1) if resolution else 'unknown',video='/'+dest.relative_to(ROOT/'public').as_posix(),poster=f'/portfolio/posters/{slug}.jpg',preview=f'/portfolio/previews/{slug}.mp4',gallery=[f'/portfolio/posters/{slug}-{i}.jpg' for i in range(1,4)])
 rows.append(row)

# Write inventory BEFORE visual development or frame encoding.
(ROOT/'data/portfolio-import.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf8')
header='| Original filename | Type | Bytes | Duration (s) | Resolution | Section | Display title | Public filename |\n|---|---|---:|---:|---|---|---|---|\n'
body=''.join(f"| {r['originalFilename']} | video/mp4 | {r['size']} | {r['duration']} | {r['resolution']} | {r['section']} | {r['title']} | {r['video']} |\n" for r in rows)
extras=[str(p.relative_to(SOURCE)) for p in files if p.is_file() and p.name not in [r['originalFilename'] for r in rows]]
(ROOT/'PORTFOLIO_INVENTORY.md').write_text('# Portfolio inventory\n\n18 matched works. Originals preserved. Year is an editable catalog year (2026), not verified production date.\n\n'+header+body+'\nUnassigned: '+(', '.join(extras) or 'none'),encoding='utf8')
(ROOT/'PORTFOLIO_MEDIA_MAP.md').write_text('# Original → public media\n\n'+body,encoding='utf8')
for row in rows:
 source=ROOT/'public'/row['video'].lstrip('/')
 for output,ratio in [(row['poster'],.2),*zip(row['gallery'],[.35,.55,.75])]:
  target=ROOT/'public'/output.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True)
  if not target.exists(): subprocess.run([FFMPEG,'-y','-ss',str(row['duration']*ratio),'-i',str(source),'-frames:v','1','-vf','scale=1440:-2','-q:v','3',str(target)],check=True,capture_output=True)
 target=ROOT/'public'/row['preview'].lstrip('/');target.parent.mkdir(parents=True,exist_ok=True)
 if not target.exists(): subprocess.run([FFMPEG,'-y','-ss',str(row['duration']*.15),'-i',str(source),'-t','8','-an','-vf','scale=960:-2','-c:v','libx264','-preset','fast','-crf','27','-movflags','+faststart',str(target)],check=True,capture_output=True)
 print('Prepared '+row['slug'],flush=True)
brand=ROOT/'public/brand';brand.mkdir(parents=True,exist_ok=True)
for original,dest in [('logo.png','kreomora-logo-light.png'),('kreomora_logo_black_on_white_exact 2.png','kreomora-logo-dark.png'),('Changing_suit_color_4K_20261007133018 1.png','kreomora-mascot.png')]:
 shutil.copy2(Path(r'C:\Users\khodo\Downloads')/original,brand/dest)
