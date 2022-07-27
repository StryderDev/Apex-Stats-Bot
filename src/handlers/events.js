function loadEvents(client) {
	const fs = require('fs');

	const folders = fs.readdirSync('./src/events');

	for (const folder of folders) {
		const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter(file => file.endsWith('.js'));

		for (const file of eventFiles) {
			const event = require(`../events/${folder}/${file}`);

			if (event.rest) {
				if (event.once) {
					client.rest.once(event.name, (...args) => event.execute(...args, client));
				} else {
					client.rest.on(event.name, (...args) => event.execute(...args, client));
				}
			} else {
				if (event.once) {
					client.once(event.name, (...args) => event.execute(...args, client));
				} else {
					client.on(event.name, (...args) => event.execute(...args, client));
				}
			}

			console.log(`${file} Loaded`);
		}
	}
}

module.exports = { loadEvents };
