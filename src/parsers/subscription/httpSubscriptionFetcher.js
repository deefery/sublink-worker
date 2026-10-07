import { decodeBase64 } from '../../utils.js';
import { parseSubscriptionContent } from './subscriptionContentParser.js';
import { UpstreamBlockedError } from '../../services/errors.js';

const SUBSCRIPTION_URI_PATTERN = /^(ss|vmess|vless|hysteria|hysteria2|hy2|trojan|tuic|anytls|http|https):\/\//i;

function isCloudflareChallenge(response, text) {
    const body = typeof text === 'string' ? text.toLowerCase() : '';
    const server = response?.headers?.get?.('server')?.toLowerCase() || '';
    const mitigated = response?.headers?.get?.('cf-mitigated')?.toLowerCase() || '';
    const challengeBody = body.includes('just a moment') ||
        body.includes('/cdn-cgi/challenge-platform') ||
        body.includes('error code: 1010');
    return mitigated === 'challenge' || (server.includes('cloudflare') && challengeBody);
}

async function readSubscriptionResponse(response, url) {
    const text = await response.text();
    if (isCloudflareChallenge(response, text)) {
        throw new UpstreamBlockedError(
            `Upstream subscription ${url} is blocked by a Cloudflare challenge. ` +
            'For Clash/Mihomo, move this URL to "Force Provider" so the client fetches it directly.'
        );
    }
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return text;
}

function hasSubscriptionUriLine(content) {
    return content
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .some(line => SUBSCRIPTION_URI_PATTERN.test(line));
}

function isLikelyTomlConfig(content) {
    return /^\s*\[[^\]]+\]\s*$/m.test(content) && /^\s*[A-Za-z0-9_.-]+\s*=/.test(content);
}

function isPlainSubscriptionContent(content) {
    if (!content || typeof content !== 'string') {
        return false;
    }
    return detectFormat(content) !== 'unknown' ||
        hasSubscriptionUriLine(content) ||
        isLikelyTomlConfig(content);
}

function decodeUriComponentIfNeeded(text) {
    const trimmed = text.trim();
    if (!trimmed.includes('%')) {
        return trimmed;
    }

    try {
        return decodeURIComponent(trimmed).trim();
    } catch (urlError) {
        console.warn('Failed to URL decode the text:', urlError);
        return trimmed;
    }
}

function normalizeBase64Candidate(text) {
    const compact = text.replace(/\s+/g, '');
    if (!compact || !/^[A-Za-z0-9+/_-]*={0,2}$/.test(compact)) {
        return null;
    }
    if (/=/.test(compact.replace(/={0,2}$/, ''))) {
        return null;
    }

    const withoutPadding = compact.replace(/=+$/, '');
    if (withoutPadding.length % 4 === 1) {
        return null;
    }

    const normalized = withoutPadding.replace(/-/g, '+').replace(/_/g, '/');
    return normalized + '='.repeat((4 - normalized.length % 4) % 4);
}

/**
 * Decode content only when the payload proves it is an encoded subscription.
 * @param {string} text - Raw text content
 * @returns {string} - Decoded content
 */
function decodeContent(text) {
    const urlDecodedText = decodeUriComponentIfNeeded(text);
    if (isPlainSubscriptionContent(urlDecodedText)) {
        return urlDecodedText;
    }

    const base64Candidate = normalizeBase64Candidate(urlDecodedText);
    if (!base64Candidate) {
        return urlDecodedText;
    }

    try {
        const decodedText = decodeUriComponentIfNeeded(decodeBase64(base64Candidate));
        if (isPlainSubscriptionContent(decodedText)) {
            return decodedText;
        }
    } catch (e) {
        return urlDecodedText;
    }

    return urlDecodedText;
}

/**
 * Detect the format of subscription content
 * @param {string} content - Decoded subscription content
 * @returns {'clash'|'singbox'|'surge'|'unknown'} - Detected format
 */
function detectFormat(content) {
    const trimmed = content.trim();

    // Try JSON (Sing-Box format)
    if (trimmed.startsWith('{')) {
        try {
            const parsed = JSON.parse(trimmed);
            if (parsed.outbounds || parsed.inbounds || parsed.route) {
                return 'singbox';
            }
        } catch {
            // Not valid JSON
        }
    }

    // Try YAML (Clash format) - check for proxies: key
    if (trimmed.includes('proxies:')) {
        return 'clash';
    }

    if (/\[(General|Proxy|Rule|Proxy Group)\]/i.test(trimmed)) {
        return 'surge';
    }

    return 'unknown';
}

/**
 * Fetch subscription content from a URL and parse it
 * @param {string} url - The subscription URL to fetch
 * @param {string} userAgent - Optional User-Agent header
 * @returns {Promise<object|string[]|null>} - Parsed subscription content
 */
export async function fetchSubscription(url, userAgent) {
    try {
        const headers = new Headers();
        if (userAgent) {
            headers.set('User-Agent', userAgent);
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        const text = await readSubscriptionResponse(response, url);
        const decodedText = decodeContent(text);

        return parseSubscriptionContent(decodedText);
    } catch (error) {
        if (error instanceof UpstreamBlockedError) {
            throw error;
        }
        console.error('Error fetching or parsing HTTP(S) content:', error);
        return null;
    }
}

/**
 * Fetch subscription content and detect its format without parsing
 * @param {string} url - The subscription URL to fetch
 * @param {string} userAgent - Optional User-Agent header
 * @returns {Promise<{content: string, format: 'clash'|'singbox'|'surge'|'unknown', url: string, subscriptionUserinfo?: string}|null>}
 */
export async function fetchSubscriptionWithFormat(url, userAgent) {
    try {
        const headers = new Headers();
        if (userAgent) {
            headers.set('User-Agent', userAgent);
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        const text = await readSubscriptionResponse(response, url);
        const content = decodeContent(text);
        const format = detectFormat(content);

        const subscriptionUserinfo = response.headers.get('subscription-userinfo') || undefined;

        return { content, format, url, subscriptionUserinfo };
    } catch (error) {
        if (error instanceof UpstreamBlockedError) {
            throw error;
        }
        console.error('Error fetching subscription:', error);
        return null;
    }
}
