const { stopping, saveConfig, loadConfig } = require('../function.js');
const config = require('../config.js');

module.exports = {
    command(client) {
        client.on('messageCreate', async (message) => {
            try {
                if (message.author.bot) return;

                if (message.author.id === client.user.id && 
                    message.content.trim().toLowerCase() === config.cmdStop.toLowerCase()) {

                    const cfg = loadConfig() || {};
                    cfg.channelId = null;
                    cfg.status = false;

                    await saveConfig(cfg);
                    stopping();
                }
            } catch (err) {
                console.error('❌ Terjadi error saat menjalankan stopFarm:', err);
            }
        });
    }
};
