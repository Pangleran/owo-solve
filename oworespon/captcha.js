const { stopping, loadConfig } = require('../function.js');
const config = require('../config.js');
const axios = require('axios').default;

module.exports = {
    async respon(client) {
        client.on('messageCreate', async (message) => {
            try {
                const cfg = loadConfig() || {};

                if (message.author.id !== config.owoId || message.channel.id !== cfg.channelId) return;

                const warnings = [
                    `⚠️ **|** <@${client.user.id}>!`,
                    `⚠️ **|** ${client.user.username}!`,
                    `**⚠️ | <@${client.user.id}>**,`,
                    `**⚠️ | ${client.user.username}**,`,
                    `**🚫 | ${client.user.id}**,`,
                    `**⚠️ |** <@${client.user.id}>,`
                ];

                if (warnings.some(text => message.content.includes(text))) {
                    await stopping();

                    const attachment = message.attachments?.first();
                    if (attachment?.url) {
                        await solveImage(client, attachment.url);
                    }

                    if (message.components?.length > 0) {
                        await solveWebsite();
                    }
                }
            } catch (err) {
                console.error('❌ Terjadi error saat menangani pesan:', err);
            }
        });
    }
};

async function solveWebsite() {
    const cfg = loadConfig();

    try {
        const solution = await hcaptchaSolve();
        const solve = await axios.post('https://owobot.com/api/captcha/verify', { token: solution }, { 
            headers: { Cookie: cfg.cookie }
        });
        if (solve.status === 200) {
            console.log(`${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Makassar' })} | Solved Captcha`);
        } else {
            console.log(`${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Makassar' })} | Unsolved Captcha`);
        }
    } catch {
        console.error('HCaptcha sudah diselesaikan');
        return;
    }
}

async function hcaptchaSolve() {
    const options = {
        method: 'GET',
        url: 'https://v1.captchaly.com/hcaptcha?url=https://owobot.com&sitekey=a6a1d5ce-612d-472d-8e37-7601408fbc09',
        headers: {Authorization: `Bearer ${config.solvekey}`}
      };

      while (true) {
        try {
          const { data } = await axios.request(options);
          console.log(`${parseInt(data.duration)} Seconds | HCaptcha Solved`);
          return data.token;
        } catch (error) {
          if (error.response?.status === 400 || error.response?.status === 503) {
            await new Promise(res => setTimeout(res, 2000));
          } else {
            console.error(error.response?.status);
            return;
          }
        }
      }
}

function replace(text) {
    return text
        .toLowerCase()
        .replace(/0/g, 'o')
        .replace(/1/g, 'i')
        .replace(/2/g, 'z')
        .replace(/3/g, 'e')
        .replace(/4/g, 'a')
        .replace(/5/g, 's')
        .replace(/6/g, 'g')
        .replace(/7/g, 't')
        .replace(/8/g, 'b')
        .replace(/9/g, 'q');
}

async function solveImage(client, image) {
  try {
      const response = await axios.get(image, {
          responseType: 'arraybuffer' });
      const base64Data = Buffer.from(response.data).toString('base64');
      const postData = {
          userId: config.,
          apikey: 'xxxx',
          data: base64Data,
          mode: 'human',
          numeric: false,
          len_str: 6
      };

      let solvedtxt = null;

      while (solvedtxt === null) {
          await new Promise(res => setTimeout(res, 10000));

          const res = await axios.post('https://api.apitruecaptcha.org/one/gettext', postData, {
              headers: { 'Content-Type': 'application/json' },
          });
          if (res.data && res.data.result) {
              solvedtxt = res.data.result;
          } else {
              console.log('image to text tidak valid, retry..');
          }
      }

      // await

      const replacetxt = await replace(solvedtxt);
      return client.users.send(config.owoId, replacetxt);
  } catch (err) {
      console.error(err.message);
  }
}
}
