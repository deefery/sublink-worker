# `home` personal-rule review — 2026-10-08

## Scope and rollback

- Source review: ShellCrash 2026-10-08 catchall analysis and its 67 exact-domain draft candidates.
- Private `captures/` data was reviewed locally and is not copied into this repository.
- Pre-change Git rollback baseline: `3b2210fd6096d97bf277aa98fd5bc0c5b7a6ef3c`.
- The original migrated 60-domain baseline is preserved and regression-tested by SHA256: `e4de46808885acf16ad01c7cc8d62575ffc51f62a92507f533feb75e150a87cb`.
- This batch changes only exact `DOMAIN` entries in `home` -> `Ad Block`; no suffix, root-domain, IP/CIDR, DNS, node, proxy-group, credential, or other-profile changes.
- Google Play mainland download routing is explicitly out of scope.

## Decision summary

- Draft candidates reviewed: 67
- Approved exact domains: 62
- Held/excluded: 5
- Resulting `home` profile: 122 exact domains = 106 Ad Block + 4 AI Services + 12 Non-China.

## Per-domain decisions

| Domain | Decision | Reason |
| --- | --- | --- |
| `ad.turn.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `api.btloader.com` | include | Approve exact host: Blockthrough adblock-recovery/ad-auction infrastructure; observed host also matched HaGeZi PRO. Exact-only block avoids widening to unrelated domains. |
| `api.id5-sync.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `api.intentiq.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `bh.contextweb.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `btloader.com` | include | Approve exact host: Blockthrough adblock-recovery/ad-auction infrastructure; observed host also matched HaGeZi PRO. Exact-only block avoids widening to unrelated domains. |
| `bttrack.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `c1.adform.net` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `cdn.1rtb.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `cdn.api.btloader.com` | include | Approve exact host: Blockthrough adblock-recovery/ad-auction infrastructure; observed host also matched HaGeZi PRO. Exact-only block avoids widening to unrelated domains. |
| `cdn.btloader.com` | include | Approve exact host: Blockthrough adblock-recovery/ad-auction infrastructure; observed host also matched HaGeZi PRO. Exact-only block avoids widening to unrelated domains. |
| `cdn.id5-sync.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `cdn.prod.uidapi.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `cdyiiyofcqpyt.online` | hold | HOLD: opaque hostname with only blocklist membership and observation evidence; no reliable ad-only purpose was established. |
| `cm.adgrx.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `counter.yadro.ru` | include | Approve exact host: analytics/counter endpoint; observed exact host matched HaGeZi PRO and fits the existing Ad Block bucket’s ads/statistics/telemetry scope. |
| `d-code.liadm.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `dis.criteo.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `eb2.3lift.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `eus.rubiconproject.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `feed.pghub.io` | include | Approve exact host: pghub.io is registered to Tapad and participates in advertising identity infrastructure; observed exact host matched HaGeZi PRO. |
| `gum.criteo.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `i.liadm.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `i6.liadm.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `id.a-mx.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `id.rlcdn.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `id5-sync.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `idx.liadm.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `lb.eu-1-id5-sync.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `lbs.eu-1-id5-sync.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `lexicon.33across.com` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `log.snssdk.com` | include | Approve exact host: observed logging/telemetry endpoint, HaGeZi PRO exact hit, and unlike abtest/gecko/security siblings it was not classified as functional-risk. Exact-only scope limits collateral impact. |
| `match.deepintent.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `match.prod.bidr.io` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `metrics.rapidedge.io` | hold | HOLD: metrics hostname plus blocklist membership is insufficient to prove an ad-only role; possible functional/measurement dependency remains. |
| `mpcfg.fancydsp.com` | include | Approve exact host: FancyDSP documentation identifies the associated SDK as an advertising SDK (interstitial/native ad loading); observed exact host matched HaGeZi PRO. |
| `onetag-sys.com` | include | Approve exact host: OneTag Advertising System/ad-tech infrastructure, independently classified as advertising; also matched HaGeZi PRO. |
| `opehs.tanx.com` | include | Approve exact host: Tanx is an advertising/media monetization platform with SDK-based commercialisation; exact SDK/config host is within that ad stack. |
| `pandg.tapad.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `pghub.io` | include | Approve exact host: pghub.io is registered to Tapad and participates in advertising identity infrastructure; observed exact host matched HaGeZi PRO. |
| `pixel-sync.sitescout.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `pixel.rubiconproject.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `pixel.tapad.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `prebid-match.dotomi.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `prebid.scope3.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `px.effirst.com` | hold | HOLD: pixel-like hostname and blocklist membership suggest tracking, but no reliable vendor/purpose evidence was found to establish ad-only use. |
| `record.revmasters.com` | hold | HOLD: record/tracking-like hostname and blocklist membership are not enough to establish ad-only use without stronger vendor evidence. |
| `rp.liadm.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `rumt-zh.com` | hold | HOLD: Tencent documents this as a Real User Monitoring/performance-reporting endpoint. It is telemetry, not an advertising endpoint; keep out of this ad-block review batch. |
| `s2s.t13.io` | include | Approve exact host: t13.io is associated with Freestar advertiser/monetization infrastructure; S2S hostname is ad-tech specific. |
| `scripts.mediavine.com` | include | Approve exact host: Mediavine documents this host as its ad script wrapper used to load ads. |
| `scripts.pubnation.com` | include | Approve exact host: PubNation is Mediavine ad-management technology; this observed script host matched HaGeZi PRO. |
| `sdk-config.tanx.com` | include | Approve exact host: Tanx is an advertising/media monetization platform with SDK-based commercialisation; exact SDK/config host is within that ad stack. |
| `sdk.1rtb.net` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |
| `sdkg.fancyapi.com` | include | Approve exact host: FancyDSP documentation identifies the associated SDK as an advertising SDK (interstitial/native ad loading); observed exact host matched HaGeZi PRO. |
| `ssbsync-global.smartadserver.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `static.btloader.com` | include | Approve exact host: Blockthrough adblock-recovery/ad-auction infrastructure; observed host also matched HaGeZi PRO. Exact-only block avoids widening to unrelated domains. |
| `static.fancyapi.com` | include | Approve exact host: FancyDSP documentation identifies the associated SDK as an advertising SDK (interstitial/native ad loading); observed exact host matched HaGeZi PRO. |
| `sync.intentiq.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `sync.ipredictive.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `sync.outbrain.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `sync.srv.stackadapt.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `t2.fancyapi.com` | include | Approve exact host: FancyDSP documentation identifies the associated SDK as an advertising SDK (interstitial/native ad loading); observed exact host matched HaGeZi PRO. |
| `token.rubiconproject.com` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `ucg.fancyapi.com` | include | Approve exact host: FancyDSP documentation identifies the associated SDK as an advertising SDK (interstitial/native ad loading); observed exact host matched HaGeZi PRO. |
| `um.simpli.fi` | include | Approve exact host: hostname is specific to ad-tech identity sync, pixel, matching, prebid, token, or server-to-server advertising flow; observed exact host matched HaGeZi PRO and had no functional-risk flag. |
| `x.bidswitch.net` | include | Approve exact host: observed candidate matched HaGeZi PRO and belongs to an advertising/measurement infrastructure family; no functional-risk, diagnostic, DNS, personal-service, or prior-retain classification applied. |

## External purpose checks used for boundary cases

- Mediavine ad script wrapper: https://help.mediavine.com/script-wrapper-overview
- PubNation ad management: https://www.pubnation.com/
- Blockthrough adblock revenue recovery: https://blockthrough.com/ and https://blockthrough.com/knowledge-base/impact-on-page-latency/
- FancyDSP advertising SDK: https://docs-mp.fancydsp.com/Android-SDK.html
- Tanx media advertising platform: https://tanx.com/login
- pghub.io registrant evidence (Tapad): https://www.whois.com/whois/pghub.io
- t13.io/Freestar advertising association: https://www.netify.ai/resources/domains/t13.io
- OneTag advertising system: https://www.ipfire.org/dbl/lists/ads/domains/onetag-sys.com
- Tencent RUM endpoint documentation for held `rumt-zh.com`: https://cloud.tencent.com.cn/document/product/248/87187

HaGeZi list membership was treated as supporting evidence, not proof of maliciousness or proof of zero functional impact.

## Pre-deploy validation

- Focused personal-rules tests: 13/13 passed.
- Full project suite: 39 files, 263/263 tests passed.
- Wrangler deploy dry-run: passed.
- Resulting profile counts: 106 Ad Block + 4 AI Services + 12 Non-China = 122 unique exact domains.
- Original 60-domain baseline SHA256: `e4de46808885acf16ad01c7cc8d62575ffc51f62a92507f533feb75e150a87cb` (unchanged).
- Approved 62-domain increment SHA256: `16b369265c0482935108e15144ada8e954b7725bddfe46b6d62085f8caf8e4dc`.
- Full 122-domain set SHA256: `a374f3d6d4534d5d843465037725c95688e663c9da0ce5be82a18f2abdf111dd`.
- Candidate-set comparison: missing=0, extra=0, held domains present=0.
