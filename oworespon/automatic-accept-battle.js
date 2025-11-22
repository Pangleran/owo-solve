const config = require('../config.js');

module.exports = {
    async respon(client) {
        client.on('messageCreate', async (message) => {
            if (message.author.id === config.owoId && message.content === `<@${client.user.id}>` && message.embeds.length > 0) {
                if (message.embeds[0].author.name.includes('challenges you to a duel!')) {
                    for (const row of message.components) {
                        for (const component of row.components) {
                            if (component.type === 'BUTTON' && component.customId === 'battle_accept') {
                                await new Promise(res => setTimeout(res, 5000));
                                try {
                                    return message.clickButton(component.customId);
                                } catch {
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}
