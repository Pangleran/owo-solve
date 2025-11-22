console.clear();
require('dotenv').config();

const Discord = require('discord.js-selfbot-v13');
const fs = require('fs');
const { running } = require('./function.js');

const config = require('./config.js');
const { getCookie } = require('./cookie-owobot.js');

const client = new Discord.Client({ checkUpdate: false });

fs.readdirSync('./commands')
.filter(file => file.endsWith('.js'))
.forEach(file => require(`./commands/${file}`).command(client));

fs.readdirSync('./utils')
.filter(file => file.endsWith('.js'))
.forEach(file => require(`./utils/${file}`).respon(client));

client.login(config.token).then(async () => {
    await getCookie();
    console.log(client.user.tag);
    require('./error/errorHandling.js').loadError(client);
    if (config.status) running(client);
}).catch((err) => {
    console.clear();
    console.error(err.message);
});
