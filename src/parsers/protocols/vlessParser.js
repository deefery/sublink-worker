import { parseServerInfo, parseUrlParams, createTlsConfig, createTransportConfig, parseBool } from '../../utils.js';

function normalizeEncodedQuerySeparators(url) {
    const questionIndex = url.indexOf('?');
    if (questionIndex < 0) return url;

    const hashIndex = url.indexOf('#', questionIndex);
    const queryEnd = hashIndex >= 0 ? hashIndex : url.length;
    const query = url.slice(questionIndex + 1, queryEnd);
    const normalizedQuery = query.replace(/%26(?=[A-Za-z][A-Za-z0-9_.-]*=)/gi, '&');

    if (normalizedQuery === query) return url;
    return `${url.slice(0, questionIndex + 1)}${normalizedQuery}${url.slice(queryEnd)}`;
}

export function parseVless(url) {
    const { addressPart, params, name } = parseUrlParams(normalizeEncodedQuerySeparators(url));
    const [uuid, serverInfo] = addressPart.split('@');
    const { host, port } = parseServerInfo(serverInfo);

    const tls = createTlsConfig(params);
    if (tls.reality) {
        tls.utls = {
            enabled: true,
            fingerprint: 'chrome'
        };
    }
    const transport = params.type !== 'tcp' ? createTransportConfig(params) : undefined;

    // `udp` is a Clash-only flag; ClashConfigBuilder reads it, SingboxConfigBuilder strips it.
    const udp = params.udp !== undefined ? parseBool(params.udp) : undefined;

    return {
        type: 'vless',
        tag: name || `${host}:${port}`,
        server: host,
        server_port: port,
        uuid: decodeURIComponent(uuid),
        tcp_fast_open: false,
        tls,
        transport,
        flow: params.flow ?? undefined,
        ...(udp !== undefined ? { udp } : {})
    };
}
