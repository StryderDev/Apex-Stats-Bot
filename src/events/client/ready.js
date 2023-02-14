const fs = require('fs');
const axios = require('axios');
const { REST } = require('@discordjs/rest');
const { Collection } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const { Routes } = require('discord-api-types/v10');

const { debug, discord } = require('../../config.json');

function uptime() {
	(function loop() {
		const uptime = process.uptime();
		const seconds = `${Math.floor(uptime % 60)} Seconds`;
		const minutes = `${Math.floor((uptime % (60 * 60)) / 60)} Minutes`;
		const hours = `${Math.floor((uptime / (60 * 60)) % 24)} Hours`;
		const days = `${Math.floor(uptime / 86400)} Days`;

		console.log(`Bot Uptime: ${days}, ${hours}, ${minutes}, ${seconds}`);

		now = new Date();
		var delay = 60000 - (now % 60000);
		setTimeout(loop, delay);
	})();
}

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// Set rotating bot presence
		(async function mapPrecenseLoop() {
			const date = new Date();
			let minutes = date.getMinutes();

			// Check and update every 5 minutes
			if (minutes % 5 == 0) {
				await wait(1000);

				axios.get(`https://api.jumpmaster.xyz/map/`).then(res => {
					const data = res.data.br;

					client.user.setPresence({ activities: [{ name: `on ${data.map.name} for ${data.times.remaining.minutes + 1} minutes` }] });
					console.log(`[>> Updated Presence Map to ${data.map.name} <<]`);
				});
			}

			var delay = 60000 - (date % 60000);
			setTimeout(mapPrecenseLoop, delay);
			console.log('Checking for presence...');
		})();

		// Display bot uptime in console
		uptime();

		// Register slash commands
		const commands = [];
		const clientID = client.user.id;
		const rest = new REST({ version: 10 }).setToken(discord.token);
		const folders = fs.readdirSync(`${__dirname}/../../commands`);

		client.commands = new Collection();

		for (const folder of folders) {
			const files = fs.readdirSync(`${__dirname}/../../commands/${folder}`).filter(file => file.endsWith('.js'));

			for (const file of files) {
				const command = require(`../../commands/${folder}/${file}`);

				commands.push(command.data.toJSON());
				client.commands.set(command.data.name, command);
			}
		}

		(async () => {
			try {
				if (debug == false) {
					await rest.put(Routes.applicationCommands(clientID), { body: commands });

					console.log(`[>> Successfully registered global slash commands <<]`);
				} else {
					// // Delete all guild-base commands
					// await rest
					// 	.put(Routes.applicationGuildCommands(clientID, discord.devGuild), { body: [] })
					// 	.then(() => console.log('Successfully deleted all guild commands.'))
					// 	.catch(console.error);

					// // Delete all global commands
					// await rest
					// 	.put(Routes.applicationCommands(clientID), { body: [] })
					// 	.then(() => console.log('Successfully deleted all application commands.'))
					// 	.catch(console.error);

					// Deploy all guild-based commands
					await rest.put(Routes.applicationGuildCommands(clientID, discord.devGuild), { body: commands });

					console.log(`[>> Successfully registered local slash commands <<]`);
				}
			} catch (error) {
				if (error) console.log(error);
			}
		})();
	},
};
