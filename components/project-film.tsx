'use client';

import {useRef, type CSSProperties} from 'react';
import {MediaVideo} from './media';

export function ProjectFilm({src, poster, title, ratio, locale}: {
  src?: string; poster: string; title: string; ratio: number; locale: 'ru' | 'en';
}) {
  const sizing = {aspectRatio: ratio, '--film-ratio': ratio} as CSSProperties;
  const ru = locale === 'ru';
  const play = ru ? 'Смотреть ролик' : 'Watch the film';
  const close = ru ? 'Закрыть видео' : 'Close video';
  const fullscreen = ru ? 'На весь экран' : 'Fullscreen';
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  function open() {
    const player = video.current;
    if (!src || !player || !dialog.current) return;
    dialog.current.showModal();
    if (!player.hasAttribute('src')) player.src = src;
    void player.play().catch(() => {});
  }

  function enterFullscreen() {
    const player = video.current;
    if (!player) return;
    if (player.requestFullscreen) {
      void player.requestFullscreen().catch(() => {});
    } else {
      (player as HTMLVideoElement & {webkitEnterFullscreen?: () => void}).webkitEnterFullscreen?.();
    }
  }

  return <>
    <div className="project-film-preview" style={sizing}>
      <MediaVideo poster={poster} alt="" objectFit="contain" priority/>
      {src && <button ref={trigger} type="button" className="ux-button project-play" onClick={open}
        aria-haspopup="dialog">
        <span aria-hidden="true">▶</span>{play}
      </button>}
    </div>
    {src && <dialog ref={dialog} className="project-player" aria-label={`${play} — ${title}`}
      onClick={event => {if (event.target === event.currentTarget) event.currentTarget.close();}}
      onClose={() => {
        const player = video.current;
        if (player) {
          player.pause();
          player.removeAttribute('src');
          player.load();
        }
        trigger.current?.focus({preventScroll: true});
      }}>
      <div className="project-player-content">
        <div className="project-player-toolbar">
          <button type="button" className="ux-button" onClick={enterFullscreen}>{fullscreen}</button>
          <button type="button" className="ux-button" autoFocus aria-label={close}
            onClick={() => dialog.current?.close()}>{close}</button>
        </div>
        <video ref={video} controls playsInline preload="none" poster={poster}
          aria-label={title} style={sizing}/>
      </div>
    </dialog>}
  </>;
}
