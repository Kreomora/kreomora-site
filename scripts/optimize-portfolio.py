"""Audit sources and preserve full source quality when web-compatible. Originals are read-only."""
from pathlib import Path
import json,re,subprocess,os,shutil
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
FF=os.environ.get('FFMPEG_PATH') or shutil.which('ffmpeg') or imageio_ffmpeg.get_ffmpeg_exe()
rows=json.loads((ROOT/'data/portfolio-import.json').read_text(encoding='utf8'))
def probe(file):
 text=subprocess.run([FF,'-hide_banner','-i',str(file)],capture_output=True,text=True).stderr
 line=next(l for l in text.splitlines() if 'Video:' in l)
 w,h=map(int,re.search(r' (\d{2,5})x(\d{2,5})',line).groups())
 duration=re.search(r'Duration: (\d+):(\d+):([\d.]+)',text)
 seconds=sum(float(n)*m for n,m in zip(duration.groups(),[3600,60,1]))
 bitrate=re.search(r'bitrate: (\d+) kb/s',text)
 return dict(width=w,height=h,codec=re.search(r'Video: ([^ ,]+)',line).group(1),pixel='yuv420p' if 'yuv420p' in line else 'other',bitrate=int(bitrate.group(1)) if bitrate else round(file.stat().st_size*8/seconds/1000),duration=seconds,bytes=file.stat().st_size,audio='Audio:' in text)
def run(args):
 p=subprocess.run([FF,'-hide_banner','-loglevel','error','-y',*map(str,args)],capture_output=True,text=True)
 if p.returncode:raise RuntimeError(p.stderr)
out=ROOT/'public/portfolio/web';out.mkdir(parents=True,exist_ok=True)
result=[]
for row in rows:
 source=ROOT/'public'/row['video'].lstrip('/');info=probe(source)
 old=probe(ROOT/'public'/row['preview'].lstrip('/'))
 web=out/f"{row['slug']}-1080.mp4";card=out/f"{row['slug']}-card-hq.mp4"
 compatible=info['codec']=='h264' and info['pixel']=='yuv420p' and min(info['width'],info['height'])<=1080
 method='Lossless stream copy; original H.264 video preserved, faststart added' if compatible else 'H.264 High / CRF 19 / yuv420p / faststart'
 if not web.exists():
  args=['-i',source,'-map','0:v:0','-map','0:a:0?']
  if compatible:args+=['-c','copy']
  else:
   ratio=min(1,1080/min(info['width'],info['height']));w=int(info['width']*ratio)//2*2;h=int(info['height']*ratio)//2*2
   args+=['-vf',f'scale={w}:{h}','-c:v','libx264','-preset','slow','-crf','19','-profile:v','high','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k']
  run([*args,'-movflags','+faststart',web])
 if not card.exists():run(['-ss',str(info['duration']*.15),'-i',web,'-t','8','-map','0:v:0','-an','-c:v','copy','-movflags','+faststart',card])
 poster=out/f"{row['slug']}-poster-hq.jpg"
 # No invented detail: retain native width up to 2560; 1080-wide sources stay 1080-wide.
 frames=[]
 for target,ratio in [(poster,.2),*[(out/f"{row['slug']}-still-{i}.jpg",r) for i,r in enumerate([.35,.55,.75],1)]]:
  if not target.exists():run(['-ss',str(info['duration']*ratio),'-i',source,'-frames:v','1','-vf','scale=min(2560\\,iw):-2','-q:v','2',target])
  if target!=poster:frames.append('/portfolio/web/'+target.name)
 actual=probe(web)
 result.append(dict(slug=row['slug'],section=row['section'],title=row['title'],source=row['video'],originalFilename=row['originalFilename'],sourceInfo=info,previousWebsite=row['preview'],previousInfo=old,web='/portfolio/web/'+web.name,card='/portfolio/web/'+card.name,poster='/portfolio/web/'+poster.name,gallery=frames,webInfo=actual,method=method))
 print(f"Ready {row['slug']}: {actual['width']}x{actual['height']} / {method}",flush=True)
(ROOT/'data/video-quality.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
lines=['# Video quality report','',f'Audited: {len(result)} sources. Sources with shortest dimension >=1080: {sum(min(r["sourceInfo"]["width"],r["sourceInfo"]["height"])>=1080 for r in result)}. Web films: {len(result)}. Sharp card clips: {len(result)}.','', 'Original masters are unchanged. Compatible 1080 H.264 files were remuxed losslessly, not recompressed. This preserves their original video bitrate/detail. Larger or incompatible sources use CRF 19. Posters retain native resolution; no artificial upscale. Fullscreen film players show the complete composition. Cinematic hero backgrounds use intentional cover cropping; all full films are accessible with contain/fullscreen.','', '| Project | Source file | Resolution | Codec | Bitrate kb/s (container) | Duration s | Source bytes | Current website file | Website resolution | Previous preview resolution | Notes |','|---|---|---|---|---:|---:|---:|---|---|---|---|']
for r in result:
 a=r['sourceInfo'];b=r['webInfo'];old=r['previousInfo'];note=r['method']+('; SOURCE BELOW 1080, retained native quality' if min(a['width'],a['height'])<1080 else '')
 lines.append(f"| {r['title']} | {r['originalFilename']} | {a['width']}×{a['height']} | {a['codec']} | {a['bitrate']} | {a['duration']} | {a['bytes']} | {r['web']} | {b['width']}×{b['height']} | {old['width']}×{old['height']} | {note} |")
lines+=['','Landscape / portrait / square counts: '+str({k:sum((r['sourceInfo']['width']>r['sourceInfo']['height'] if k=='landscape' else r['sourceInfo']['width']<r['sourceInfo']['height'] if k=='portrait' else r['sourceInfo']['width']==r['sourceInfo']['height']) for r in result) for k in ['landscape','portrait','square']}),'','CMS web copies use the same basenames under /api/media/file/. Hero and film use the full web copy; cards use the HQ clip. Old proxies remain archived and are no longer referenced by published portfolio projects.']
(ROOT/'VIDEO_QUALITY_REPORT.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
