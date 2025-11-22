const { stopping } = require('../function.js');
const config = require('../config.js');

module.exports = {
    async respon(client) {
        client.on('messageCreate', async (message) => {
            if (message.author.id === client.user.id && message.channel.id === config.channelId && message.content.toLowerCase() === 'owo') {
                const messages = await message.channel.messages.fetch({
                    limit: 10
                });
                const response = messages.find(msg => msg.author.id === config.owoId);

                if (!response) return stopping();
            }
        });
    }
}
