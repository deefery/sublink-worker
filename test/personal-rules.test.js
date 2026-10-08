import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import yaml from 'js-yaml';
import { createApp } from '../src/app/createApp.jsx';
import { MemoryKVAdapter } from '../src/adapters/kv/memoryKv.js';
import { generateRules, getPersonalRuleProfile, PERSONAL_RULE_PROFILES } from '../src/config/index.js';
import { emitClashRules } from '../src/builders/helpers/clashConfigUtils.js';

const TEST_NODE = 'vmess://ew0KICAidiI6ICIyIiwNCiAgInBzIjogInRlc3QiLA0KICAiYWRkIjogIjEuMS4xLjEiLA0KICAicG9ydCI6ICI0NDMiLA0KICAiaWQiOiAiYWRkNjY2NjYtODg4OC04ODg4LTg4ODgtODg4ODg4ODg4ODg4IiwNCiAgImFpZCI6ICIwIiwNCiAgInNjeSI6ICJhdXRvIiwNCiAgIm5ldCI6ICJ3cyIsDQogICJ0eXBlIjogIm5vbmUiLA0KICAiaG9zdCI6ICIiLA0KICAicGF0aCI6ICIvIiwNCiAgInRscyI6ICJ0bHMiDQp9';

function createTestApp(kv = new MemoryKVAdapter()) {
    return createApp({
        kv,
        assetFetcher: null,
        logger: console,
        config: { configTtlSeconds: 60, shortLinkTtlSeconds: null }
    });
}

function profileUrl(path) {
    const params = new URLSearchParams({
        config: TEST_NODE,
        selectedRules: 'minimal',
        personal_rules: 'home',
        lang: 'en-US'
    });
    return `http://localhost/${path}?${params.toString()}`;
}

describe('personal exact-domain rule profiles', () => {
    it('contains exactly 122 unique reviewed domains with the expected policy split', () => {
        const profile = getPersonalRuleProfile('home');
        expect(profile).not.toBeNull();
        const counts = Object.fromEntries(profile.rules.map(rule => [rule.name, rule.domain.length]));
        expect(counts).toEqual({
            'Ad Block': 106,
            'AI Services': 4,
            'Non-China': 12
        });
        const allDomains = profile.rules.flatMap(rule => rule.domain);
        expect(allDomains).toHaveLength(122);
        expect(new Set(allDomains).size).toBe(122);
    });

    it('preserves the original migrated 60-domain baseline and policies', () => {
        const profile = getPersonalRuleProfile('home');
        const adRule = profile.rules.find(rule => rule.name === 'Ad Block');
        const aiRule = profile.rules.find(rule => rule.name === 'AI Services');
        const functionalRule = profile.rules.find(rule => rule.name === 'Non-China');
        const legacyDomains = [
            ...adRule.domain.slice(0, 44),
            ...aiRule.domain,
            ...functionalRule.domain
        ].sort();
        const hash = createHash('sha256').update(legacyDomains.join('\n')).digest('hex');
        expect(hash).toBe('e4de46808885acf16ad01c7cc8d62575ffc51f62a92507f533feb75e150a87cb');
        expect(adRule.domain.slice(44)).toHaveLength(62);
        ['cdyiiyofcqpyt.online','metrics.rapidedge.io','px.effirst.com','record.revmasters.com','rumt-zh.com'].forEach(domain => {
            expect(adRule.domain).not.toContain(domain);
        });
    });

    it('keeps exact DOMAIN rules ahead of broader DOMAIN-SUFFIX rules', () => {
        const rules = generateRules(
            [],
            [{ name: 'Ad Block', domain_suffix: 'example.com' }],
            [{ name: 'Non-China', domain: 'api.example.com' }]
        );
        const emitted = emitClashRules(rules, key => key.replace('outboundNames.', ''));
        const exactIndex = emitted.indexOf('DOMAIN,api.example.com,Non-China');
        const suffixIndex = emitted.indexOf('DOMAIN-SUFFIX,example.com,Ad Block');
        expect(exactIndex).toBeGreaterThanOrEqual(0);
        expect(suffixIndex).toBeGreaterThan(exactIndex);
    });

    it('deduplicates exact domains and rejects widened/non-domain input', () => {
        const rules = generateRules([], [{ name: 'Non-China', domain: 'Api.Example.com,api.example.com' }]);
        expect(rules[0].domain).toEqual(['api.example.com']);
        expect(() => generateRules([], [{ name: 'Non-China', domain: '*.example.com' }])).toThrow(/Invalid exact DOMAIN/);
        expect(() => generateRules([], [{ name: 'Non-China', domain: 'https:\/\/example.com\/path' }])).toThrow(/Invalid exact DOMAIN/);
    });

    it('resolves a stable profile id against the current rule source', () => {
        const oldRegistry = {
            home: { id: 'home', label: 'Home', description: '', rules: [{ name: 'Non-China', domain: ['old.example.com'] }] }
        };
        const newRegistry = {
            home: { id: 'home', label: 'Home', description: '', rules: [{ name: 'Non-China', domain: ['new.example.com'] }] }
        };
        expect(getPersonalRuleProfile('home', oldRegistry).rules[0].domain).toEqual(['old.example.com']);
        expect(getPersonalRuleProfile('home', newRegistry).rules[0].domain).toEqual(['new.example.com']);
        expect(PERSONAL_RULE_PROFILES.home.id).toBe('home');
    });

    it('emits all 122 exact domains in Clash and references real policy groups', async () => {
        const app = createTestApp();
        const response = await app.request(profileUrl('clash'));
        expect(response.status).toBe(200);
        const config = yaml.load(await response.text());
        const domainRules = config.rules.filter(rule => rule.startsWith('DOMAIN,'));
        expect(domainRules).toHaveLength(122);
        const groupNames = new Set((config['proxy-groups'] || []).map(group => group.name));
        domainRules.forEach(rule => expect(groupNames.has(rule.split(',')[2])).toBe(true));
        expect(config.rules.at(-1)).toMatch(/^MATCH,/);
    });

    it('does not accumulate duplicate personal rules across repeated generation', async () => {
        const app = createTestApp();
        for (let i = 0; i < 2; i += 1) {
            const response = await app.request(profileUrl('clash'));
            const config = yaml.load(await response.text());
            const domainRules = config.rules.filter(rule => rule.startsWith('DOMAIN,'));
            expect(domainRules).toHaveLength(122);
            expect(new Set(domainRules).size).toBe(122);
        }
    });

    it('stores only the stable profile id in short links and resolves current rules on fetch', async () => {
        const kv = new MemoryKVAdapter();
        const app = createTestApp(kv);
        const longUrl = profileUrl('clash');
        const shorten = await app.request(`http://localhost/shorten-v2?url=${encodeURIComponent(longUrl)}&shortCode=homeRules`);
        expect(shorten.status).toBe(200);
        expect(await shorten.text()).toBe('homeRules');

        const stored = await kv.get('homeRules');
        expect(stored).toContain('personal_rules=home');
        expect(stored).not.toContain('adx-cfg-u1.ubixioe.com');

        const redirect = await app.request('http://localhost/c/homeRules');
        expect(redirect.status).toBe(302);
        const resolved = await app.request(redirect.headers.get('location'));
        const config = yaml.load(await resolved.text());
        expect(config.rules.filter(rule => rule.startsWith('DOMAIN,')).length).toBe(122);
    });

    it('emits all 122 exact domains in Sing-box with reject and existing outbound semantics', async () => {
        const app = createTestApp();
        const response = await app.request(profileUrl('singbox'));
        expect(response.status).toBe(200);
        const config = await response.json();
        const domainRules = config.route.rules.filter(rule => Array.isArray(rule.domain));
        expect(domainRules.reduce((sum, rule) => sum + rule.domain.length, 0)).toBe(122);
        const adRule = domainRules.find(rule => rule.domain.includes('adx-cfg-u1.ubixioe.com'));
        expect(adRule.action).toBe('reject');
        const outboundTags = new Set(config.outbounds.map(outbound => outbound.tag));
        const routedOutbounds = domainRules.map(rule => rule.outbound).filter(Boolean);
        routedOutbounds.forEach(outbound => expect(outboundTags.has(outbound)).toBe(true));
    });

    it('emits all 122 exact domains in Surge and keeps FINAL last', async () => {
        const app = createTestApp();
        const response = await app.request(profileUrl('surge'));
        expect(response.status).toBe(200);
        const text = await response.text();
        const ruleSection = text.split('[Rule]')[1]?.split('\n[')[0] || '';
        const lines = ruleSection.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        expect(lines.filter(line => line.startsWith('DOMAIN,')).length).toBe(122);
        expect(lines.at(-1)).toMatch(/^FINAL,/);
    });

    it('emits all 122 exact domains for subconverter', async () => {
        const app = createTestApp();
        const response = await app.request('http://localhost/subconverter?selectedRules=minimal&personal_rules=home&lang=en-US');
        expect(response.status).toBe(200);
        const text = await response.text();
        expect(text.split(/\r?\n/).filter(line => line.includes('[]DOMAIN,')).length).toBe(122);
    });

    it('keeps legacy Xray output working and explicitly rejects personal routing profiles there', async () => {
        const app = createTestApp();
        const legacy = await app.request(`http://localhost/xray?config=${encodeURIComponent(TEST_NODE)}`);
        expect(legacy.status).toBe(200);
        const unsupported = await app.request(`http://localhost/xray?config=${encodeURIComponent(TEST_NODE)}&personal_rules=home`);
        expect(unsupported.status).toBe(400);
        expect(await unsupported.text()).toContain('not supported');
    });

    it('returns 400 for an unknown personal profile and invalid custom exact domain', async () => {
        const app = createTestApp();
        const unknownParams = new URLSearchParams({ config: TEST_NODE, personal_rules: 'missing' });
        const unknown = await app.request(`http://localhost/clash?${unknownParams.toString()}`);
        expect(unknown.status).toBe(400);

        const customRules = JSON.stringify([{ name: 'Non-China', domain: '*.example.com' }]);
        const invalid = await app.request(`http://localhost/clash?config=${encodeURIComponent(TEST_NODE)}&customRules=${encodeURIComponent(customRules)}`);
        expect(invalid.status).toBe(400);
        expect(await invalid.text()).toContain('Invalid exact DOMAIN');
    });
});
