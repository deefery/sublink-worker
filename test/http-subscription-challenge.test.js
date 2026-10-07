import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchSubscriptionWithFormat } from '../src/parsers/subscription/httpSubscriptionFetcher.js';

describe('HTTP subscription Cloudflare challenge detection', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('surfaces a Cloudflare challenge instead of parsing the HTML as a subscription', async () => {
        const html = '<!doctype html><html><head><title>Just a moment...</title></head>' +
            '<body><script src="/cdn-cgi/challenge-platform/scripts/jsd/main.js"></script></body></html>';
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(html, {
            status: 200,
            headers: { server: 'cloudflare', 'content-type': 'text/html' }
        })));

        await expect(fetchSubscriptionWithFormat('https://blocked.example/sub', 'Clash.Meta'))
            .rejects.toMatchObject({
                name: 'UpstreamBlockedError',
                status: 502,
                message: expect.stringContaining('Force Provider')
            });
    });
});
