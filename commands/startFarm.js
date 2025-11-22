const { running, loadConfig, saveConfig } = require('../function.js');
const config = require('../config.js');

module.exports = {
    command(client) {
        client.on('messageCreate', async (message) => {
            try {
                if (message.author.bot) return;

                if (message.author.id === client.user.id && 
                    message.content.trim().toLowerCase() === config.cmdRun.toLowerCase()) {

                    const cfg = loadConfig() || {};
                    cfg.channelId = message.channel?.id || null;
                    cfg.status = true;

                    await saveConfig(cfg);
                    running(client);
                }
            } catch (err) {
                console.error('❌ Terjadi error saat menjalankan startFarm:', err);
            }
        });
    }
};
