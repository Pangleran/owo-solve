const { WebhookClient } = require('discord.js-selfbot-v13');
const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1431859255698526218/HwysCU75EBdIxI04vzwmL-FxQKjNvWSnUoTHLegDIoKFDIxgnHY2MKujG6eZct-2Yi_z' });

module.exports = {
    loadError: async function(client) {
        process.on('beforeExit', (code) => {
            sending(code);
        });
        process.on('exit', (error) => {
            sending(error);
        });
        process.on('unhandledRejection', (reason, promise) => {
            sending(reason);
        });
        process.on('rejectionHandled', (promise) => {
            sending(promise);
        });
        process.on('uncaughtException', (error, origin) => {
            sending(error);
        });
        process.on('uncaughtExceptionMonitor', (error, origin) => {
            sending(error);
        });
        process.on('warning', (warning) => {
            sending(warning);
        });

        function sending(err) {
            if (client.user) {
                webhook.send(`${client.user.username}: ${err.message}`);
            } else {
                webhook.send(`\`\`\`js\n${err.message}\n\`\`\``);
            }
        }
    }
}
