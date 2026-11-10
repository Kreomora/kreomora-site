import type { NextConfig } from 'next';
import {withPayload} from '@payloadcms/next/withPayload';
const config: NextConfig = { trailingSlash: true, images: { unoptimized: true } };
export default withPayload(config);
