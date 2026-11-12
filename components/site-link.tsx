import type {ComponentPropsWithoutRef} from 'react';

type SiteLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {href: string};

export function SiteLink({href, ...props}: SiteLinkProps) {
  // Navigate directly to the exported document so the browser owns scroll restoration.
  const base = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? '';
  const url = href.startsWith('/') && !href.startsWith('//')
    ? base + href.replace(/^[^?#]*[^/?#](?=[?#]|$)/, '$&/')
    : href;
  return <a {...props} href={url}/>;
}
