const HOME_AD_DOMAINS = [
    'adx-cfg-u1.ubixioe.com',
    'fcount-api.webapp.easebar.com',
    'adblock.telemetry.eyeo.com',
    'adx.ads.vungle.com',
    'adx.mosspf.com',
    'amplify.outbrain.com',
    'analytics-tcp.mintegral.net',
    'api.myadsget.com',
    'api.rlcdn.com',
    'browser-intake-us5-datadoghq.com',
    'c.cnzz.com',
    'cdn-gl.imrworldwide.com',
    'cdn.bizible.com',
    'cdn.brandmetrics.com',
    'cdn.cxense.com',
    'cdn.parsely.com',
    'collector.brandmetrics.com',
    'comcluster.cxense.com',
    'config.ads.vungle.com',
    'configure-tcp-android.mtgglobals.com',
    'distribution.rqmob.com',
    'id.cxense.com',
    'insight.adsrvr.org',
    'logx.optimizely.com',
    'match.adsrvr.org',
    'mcdp-wndc1.outbrain.com',
    'merequartz.com',
    'mv.outbrain.com',
    'net.mtgglobals.com',
    'p1.parsely.com',
    'quadquality.com',
    's4.cnzz.com',
    'secure-us.imrworldwide.com',
    'segment-data.zqtk.net',
    'tkda.mosspf.com',
    'tr.outbrain.com',
    'track.celtra.com',
    'us.tags.newscgp.com',
    'vg-new-ssplib-hb.mtgglobals.com',
    'vtrk.dv.tech',
    'wave.outbrain.com',
    'widgets.outbrain.com',
    'www.dianomi.com',
    'z11.cnzz.com'
];

const HOME_AI_DOMAINS = [
    'registry.ollama.ai',
    'api.openlux.ai',
    'www.openlux.ai',
    'yunwu.ai'
];

const HOME_FUNCTIONAL_DOMAINS = [
    'dns.twnic.tw',
    'api.revenuecat.com',
    'api.languagetoolplus.com',
    'core2.myqnapcloud.io',
    'edge.myqnapcloud.io',
    'api-js.datadome.co',
    'js.datadome.co',
    'ct.captcha-delivery.com',
    'geo.captcha-delivery.com',
    'static.captcha-delivery.com',
    'open-api.spot.im',
    'cdn.privacy-mgmt.com'
];

export const PERSONAL_RULE_PROFILES = Object.freeze({
    home: Object.freeze({
        id: 'home',
        label: 'Home personal rules',
        description: 'Reviewed exact-domain rules migrated from ShellCrash catchall analysis.',
        rules: Object.freeze([
            Object.freeze({ name: 'Ad Block', domain: Object.freeze(HOME_AD_DOMAINS) }),
            Object.freeze({ name: 'AI Services', domain: Object.freeze(HOME_AI_DOMAINS) }),
            Object.freeze({ name: 'Non-China', domain: Object.freeze(HOME_FUNCTIONAL_DOMAINS) })
        ])
    })
});

function cloneRules(rules = []) {
    return rules.map(rule => ({
        ...rule,
        domain: Array.isArray(rule.domain) ? [...rule.domain] : []
    }));
}

export function getPersonalRuleProfile(profileId, profiles = PERSONAL_RULE_PROFILES) {
    if (!profileId) return null;
    const profile = profiles[profileId];
    if (!profile) return null;
    const rules = cloneRules(profile.rules);
    return {
        id: profile.id,
        label: profile.label,
        description: profile.description,
        rules,
        outbounds: [...new Set(rules.map(rule => rule.name).filter(Boolean))]
    };
}

export function getPersonalRuleProfileOptions() {
    return Object.values(PERSONAL_RULE_PROFILES).map(profile => ({
        id: profile.id,
        label: profile.label,
        description: profile.description,
        ruleCount: profile.rules.reduce((sum, rule) => sum + (rule.domain?.length || 0), 0)
    }));
}
