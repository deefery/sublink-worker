# Personal exact-domain rules

This project has an opt-in personal rule profile for the household subscriptions served by `sub.zhijic.com`.

## Single source of truth

- Profile ID: `home`
- Rule source: `src/config/personalRuleProfiles.js`
- Current reviewed set: 60 exact `DOMAIN` entries
  - 44 -> `Ad Block`
  - 4 -> `AI Services`
  - 12 -> `Non-China`

The list was migrated from the reviewed ShellCrash catchall rule files dated 2026-10-02 and 2026-10-03. Do not copy browser capture logs into this repository. Domains that were only observed but not approved remain unchanged.

These are exact host matches. Do not replace them with `DOMAIN-SUFFIX`, root-domain rules, IP CIDRs, DNS overrides, or shared IP rules merely to reduce the list.

## How subscriptions opt in

The stable URL parameter is:

```text
personal_rules=home
```

The web UI exposes the same choice under **Personal Rule Profile / 个人规则源**. It is off by default, so other Sublink users and existing subscriptions are not affected.

When enabled, the profile is included in Clash/Mihomo, Sing-box, Surge, and subconverter links. The Xray endpoint is a Base64 node list rather than a routing configuration, so it cannot carry these rules; a manually supplied `personal_rules` parameter on `/xray` returns an explicit error instead of silently dropping the rules.

## Matching and policy behavior

The exact-domain chain is supported end-to-end in `customRules` as the `domain` field. Existing fields such as `domain_suffix`, `domain_keyword`, `site`, `ip`, `ip_cidr`, and `src_ip_cidr` remain compatible.

Personal exact rules are generated before broader domain suffix, keyword, remote rule-set, and final/fallback rules. This allows an exact exception to win before a broader category rule.

The profile reuses existing policies instead of creating duplicate categories:

- `Ad Block` -> the existing ad-block policy semantics for each output format
- `AI Services` -> the existing AI policy group
- `Non-China` -> the existing non-China policy group

No node, DNS, inbound, proxy-entry, or selector-option changes are part of this feature.

## Output formats

| Output | Exact rule representation | Personal profile |
| --- | --- | --- |
| Clash / Mihomo | `DOMAIN,host,policy` | Supported |
| Sing-box | route rule `domain: [host, ...]` | Supported |
| Surge | `DOMAIN,host,policy` | Supported |
| Subconverter | `ruleset=policy,[]DOMAIN,host` | Supported |
| Xray Base64 node list | No routing-rule container | Not supported; explicit error if forced |

## Why this does not use config IDs

Saved base-config IDs use `ConfigStorageService` and default to a 30-day TTL unless runtime configuration overrides it. They are therefore not suitable as the long-lived personal-rule source.

The `home` profile is bundled with the deployed application instead. A subscription URL or short link stores only the stable profile ID. After the rule source is edited and the Worker is redeployed, the same subscription URL resolves the current profile contents.

Short-link storage is independent of the profile contents. The current Cloudflare deployment does not configure a short-link TTL.

## Add or remove an exact rule

1. Edit only `src/config/personalRuleProfiles.js`.
2. Put the complete hostname in exactly one of the three arrays/policies. Do not add schemes, paths, wildcards, root-domain expansions, or IP addresses.
3. Run the focused test:

   ```powershell
   npm test -- test/personal-rules.test.js
   ```

4. Run the full project test suite:

   ```powershell
   npm test
   ```

5. Validate the Worker bundle:

   ```powershell
   npx wrangler deploy --dry-run
   ```

6. Deploy normally. Existing device subscription URLs that already contain `personal_rules=home` do not need to be replaced; refresh/update the subscription on the client.

The regression tests verify total count, per-policy count, uniqueness, exact-vs-suffix ordering, repeated generation, output-format mapping, stable short-link storage, invalid exact-domain rejection, and Xray unsupported behavior.

## Custom exact rules from the UI / JSON

The custom-rule form now has an **Exact Domain / 精确域名** field. JSON custom rules can use:

```json
[
  {
    "name": "Non-China",
    "domain": ["api.example.com"]
  }
]
```

Exact domains are validated and deduplicated. Wildcards, URLs, paths, and malformed hostnames are rejected instead of being widened to suffix rules.

## Rollback

Pre-migration rollback points recorded before this feature:

- Git HEAD: `05a69445f87fa4a73dd78b8900ea6626571330a4`
- Cloudflare Worker version: `616c2ad6-b1b8-48bd-8dc9-e5724e509c4f`

For code rollback, restore/redeploy the known-good Git revision or revert the personal-rule commit. For Cloudflare rollback, redeploy the known-good revision or use Cloudflare deployment rollback to the recorded Worker version if it is still retained by the platform.

This feature does not modify persistent KV data, so there is no personal-rule KV dataset to restore. Existing short links and saved configs are left untouched.

## ShellCrash migration boundary

Keep the router-local catchall rules until all of the following are true:

1. The router is using a subscription URL with `personal_rules=home`.
2. A subscription refresh produces the expected exact rules in the generated ShellCrash config.
3. CrashCore on port `9999` reports a healthy loaded configuration and the expected rules are present/effective.
4. A backup of the router-side rule/config files exists.

Only then may duplicate router-local entries from this migration be removed. Router-specific rules and unrelated providers must remain. Reload ShellCrash/CrashCore only; do not reboot the whole router for this migration.

Chrome WebRTC protection remains a browser setting and is intentionally outside this rule source.
