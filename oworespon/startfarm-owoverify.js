const { running } = require('../function.js');
const config = require('../config.js');

module.exports = {
    async respon(client) {
        client.on('messageCreate', async (message) => {
            if (message.author.id === config.owoId && message.channel.type === 'DM' && message.content.includes('Thank')) {
                setTimeout(() => return running(client), Math.floor(Math.random() * (18000 - 15000 + 1) + 18000));
            }
        });
    }
}
