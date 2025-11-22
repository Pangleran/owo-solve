const { loadConfig, saveConfig } = require('./function.js');
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

async function getCookie() {
  const cfg = loadConfig();

  const jar = new CookieJar();
  const client = wrapper(
    axios.create({
      jar,
      withCredentials : true,
      maxRedirects : 0,
      validateStatus : null
    })
  );

  try {
    const uri = 'https://owobot.com/api/auth/discord';
    const r = await client.get(uri);
    const oauthReqStr = r.headers.location;

    if (!oauthReqStr) throw new Error('Tidak ada header Location.');

    const oauthPage = await client.get(oauthReqStr);
    const match = oauthPage.data.match(/<a\s+href="([^"]+)"/i);
    if (!match) throw new Error('Gagal mem-parse refer_oauth.');

    const refer_oauth = match[1];

    const payload = { permissions: '0', authorize: true };

    const postHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0',
      'Accept-Language' : 'en-US,en;q=0.5',
      'Accept-Encoding' : 'gzip, deflate, br',
      'Content-Type' : 'application/json',
      'Authorization' : cfg.token,
      'X-Discord-Locale' : 'en-US',
      'X-Debug-Options' : 'bugReporterEnabled',
      'Origin' : 'https://discord.com',
      'Referer' : refer_oauth,
      'Connection' : 'keep-alive',
      'Sec-Fetch-Dest' : 'empty',
      'Sec-Fetch-Mode' : 'cors',
      'Sec-Fetch-Site' : 'same-origin',
      'TE' : 'trailers'
    };
    const resp = await client.post(oauthReqStr, payload, { headers: postHeaders });

    if (resp.status !== 200) {
      console.log('(!) Submit error:', resp.status);
      return;
    }

    if (resp.data?.location) {
      const locauri = resp.data.location;
      const hosturi = locauri.replace(/^https?:\/\//, '').split('/')[0];

      const getHeaders = {
        'accept-encoding' : 'gzip, deflate, br',
        'accept-language' : 'en-US,en;q=0.5',
        'connection' : 'keep-alive',
        'host' : hosturi,
        'referer' : 'https://discord.com/',
        'sec-fetch-dest' : 'document',
        'sec-fetch-mode' : 'navigate',
        'sec-fetch-site' : 'cross-site',
        'sec-fetch-user' : '?1',
        'upgrade-insecure-requests' : '1',
        'user-agent' : postHeaders['User-Agent']
      };

      const res2 = await client.get(locauri, { headers: getHeaders, maxRedirects: 0, validateStatus: null });
      const cookieHeader = res2.headers['set-cookie']?.[0];
      const cookieStr = cookieHeader?.split(';')[0];

      if (res2.status === 302 || res2.status === 307) {
        cfg.cookie = cookieStr;
        return saveConfig(cfg);
      } else {
        console.log('(-) Failed to add token to OAuth');
      }
    } else if (resp.data?.includes?.('You need to verify your account')) {
      console.log('(!) Invalid token');
    } else {
      console.log('(!) Submit error (format respons tak terduga).');
    }
  } catch (err) {
    console.error('(X) Terjadi error:', err.message);
  }
}

module.exports = { getCookie };
