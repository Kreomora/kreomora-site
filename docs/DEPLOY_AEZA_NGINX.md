# KREOMORA на Aéza и Nginx

Соберите релиз в рабочей копии репозитория. Для сборки используйте Node.js 22.23.4 или версию, указанную в package.json, и Git LFS.

```sh
git lfs pull --include="public/portfolio/web/optimized/*.mp4" --exclude=""
npm ci
npm run build
node scripts/test-pages.mjs --netlify
```

Перенесите содержимое `.netlify-build/out/` в отдельный каталог релиза на VPS и направьте `/var/www/kreomora/current` на него. Для отката сохраните предыдущий каталог и переключите ссылку `current` обратно. Публичный корень содержит `index.html`, `ru/`, `en/`, `404.html`, `robots.txt`, `sitemap.xml` и ресурсы. Nginx обслуживает их как файлы.

## DNS и сертификат

Создайте записи DNS для `kreomora.ru` и `www.kreomora.ru`, ведущие на VPS. Публикуйте AAAA только при настроенном IPv6. Разрешите входящие TCP 80 и 443. Установите Nginx, Certbot и плагин Certbot для Nginx по инструкции для вашей ОС.

Сначала включите временный HTTP server block с обоими именами и указанным ниже document root, проверьте DNS и выполните `sudo nginx -t`. Затем выпустите сертификат командой `sudo certbot certonly --nginx -d kreomora.ru -d www.kreomora.ru`. После получения сертификата включите окончательную конфигурацию. Проверьте продление командой `sudo certbot renew --dry-run`.

## Пример конфигурации

Разместите `map` и блоки `server` в контексте `http`, например в файле, подключённом из `conf.d`. Если в системе уже настроен `mime.types` на уровне `http`, сохраните его.

```nginx
map $uri $kreomora_cache {
    default                 "no-cache";
    ~^/_next/static/        "public, max-age=31536000, immutable";
    ~^/(brand|fonts|media)/ "public, max-age=86400";
    ~^/portfolio/.*\.mp4$   "public, max-age=86400";
    ~^/portfolio/           "public, max-age=86400";
}

server {
    listen 80;
    server_name kreomora.ru www.kreomora.ru;
    return 301 https://kreomora.ru$request_uri;
}

server {
    listen 443 ssl;
    server_name www.kreomora.ru;
    ssl_certificate /etc/letsencrypt/live/kreomora.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kreomora.ru/privkey.pem;
    return 301 https://kreomora.ru$request_uri;
}

server {
    listen 443 ssl;
    server_name kreomora.ru;
    ssl_certificate /etc/letsencrypt/live/kreomora.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kreomora.ru/privkey.pem;

    root /var/www/kreomora/current;
    index index.html;
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    autoindex off;
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css text/plain application/javascript application/json application/xml image/svg+xml;

    add_header Cache-Control $kreomora_cache;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    location = / { return 302 /ru/; }
    location / { try_files $uri $uri/ =404; }
    error_page 404 /404.html;
    location = /404.html { internal; }
}
```

Nginx добавляет завершающий слеш при открытии директории и отдаёт её `index.html`. Для отсутствующего файла сохраняется статус 404. В `mime.types` проверьте соответствия `video/mp4 mp4` и `font/ttf ttf`. Обычная статическая выдача Nginx поддерживает Range и HTTP 206. Оставьте MP4 вне gzip. Brotli можно включить для HTML, CSS и JS, если соответствующий модуль уже установлен.

Хешированные ресурсы получают длительный кеш. HTML, sitemap и robots перепроверяются. Медиа со стабильными именами кешируются сутки. Если при новом релизе заменяются файлы по тем же URL, браузер может использовать предыдущую версию до истечения этого срока.

```sh
sudo nginx -t
sudo systemctl reload nginx
curl -I https://kreomora.ru/ru/studio/
curl -I https://kreomora.ru/en/multstory/3d-story/
curl -I https://kreomora.ru/nonexistent/
curl -I https://www.kreomora.ru/en/
curl -I -H 'Range: bytes=0-63' https://kreomora.ru/portfolio/web/optimized/3d-story-1080.mp4
```

Ожидаются 200 для страниц, 404 для отсутствующей страницы, 301 с www и 206 с `Content-Type: video/mp4` и `Content-Range` для фильма. Netlify добавляет `X-Robots-Tag: noindex` из своего конфига. На Nginx индексирование разрешено через `robots.txt`.

[Директивы Nginx](https://nginx.org/en/docs/http/ngx_http_core_module.html) · [Настройки gzip](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)
