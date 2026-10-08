const HOME_AD_DOMAINS_BASELINE = [
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

const HOME_AD_DOMAINS_2026_10_08 = [
    'ad.turn.com',
    'api.btloader.com',
    'api.id5-sync.com',
    'api.intentiq.com',
    'bh.contextweb.com',
    'btloader.com',
    'bttrack.com',
    'c1.adform.net',
    'cdn.1rtb.com',
    'cdn.api.btloader.com',
    'cdn.btloader.com',
    'cdn.id5-sync.com',
    'cdn.prod.uidapi.com',
    'cm.adgrx.com',
    'counter.yadro.ru',
    'd-code.liadm.com',
    'dis.criteo.com',
    'eb2.3lift.com',
    'eus.rubiconproject.com',
    'feed.pghub.io',
    'gum.criteo.com',
    'i.liadm.com',
    'i6.liadm.com',
    'id.a-mx.com',
    'id.rlcdn.com',
    'id5-sync.com',
    'idx.liadm.com',
    'lb.eu-1-id5-sync.com',
    'lbs.eu-1-id5-sync.com',
    'lexicon.33across.com',
    'log.snssdk.com',
    'match.deepintent.com',
    'match.prod.bidr.io',
    'mpcfg.fancydsp.com',
    'onetag-sys.com',
    'opehs.tanx.com',
    'pandg.tapad.com',
    'pghub.io',
    'pixel-sync.sitescout.com',
    'pixel.rubiconproject.com',
    'pixel.tapad.com',
    'prebid-match.dotomi.com',
    'prebid.scope3.com',
    'rp.liadm.com',
    's2s.t13.io',
    'scripts.mediavine.com',
    'scripts.pubnation.com',
    'sdk-config.tanx.com',
    'sdk.1rtb.net',
    'sdkg.fancyapi.com',
    'ssbsync-global.smartadserver.com',
    'static.btloader.com',
    'static.fancyapi.com',
    'sync.intentiq.com',
    'sync.ipredictive.com',
    'sync.outbrain.com',
    'sync.srv.stackadapt.com',
    't2.fancyapi.com',
    'token.rubiconproject.com',
    'ucg.fancyapi.com',
    'um.simpli.fi',
    'x.bidswitch.net'
];

const HOME_AD_DOMAINS = Object.freeze([
    ...HOME_AD_DOMAINS_BASELINE,
    ...HOME_AD_DOMAINS_2026_10_08
]);

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
