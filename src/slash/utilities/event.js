const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Shows current or future event information.')
		.addBooleanOption(option => option.setName('compact').setDescription('test').setRequired(false)),
	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading in-game event information...`).setColor('2F3136');

		await interaction.editReply({ embeds: [loadingEmbed] });

		// Options
		const isCompact = interaction.options.getBoolean('compact');

		function compactEmbed(option) {
			return !option ? false : true;
		}

		await axios
			.get(`https://api.apexstats.dev/events`)
			.then(response => {
				const data = response.data.event;

				const preEvent = new EmbedBuilder()
					.setTitle(`Countdown to ${data.name}`)
					.setURL(data.assets.link)
					.setDescription(`${data.description}\n\n[Link to Article](${data.assets.link})`)
					.addFields([
						{ name: 'Start Date', value: `<t:${data.time.startTimestamp}:f>\nor <t:${data.time.startTimestamp}:R>`, inline: true },
						{
							name: 'End Date',
							value: `<t:${data.time.endTimestamp}:f>\nor <t:${data.time.endTimestamp}:R>`,
							inline: true,
						},
					])
					.setImage(data.assets.image)
					.setColor('2F3136')
					.setFooter({ text: 'Dates are formatted automatically for your timezone.' });

				const activeEvent = new EmbedBuilder()
					.setTitle(data.name)
					.setURL(data.assets.link)
					.setDescription(`${data.description}\n\n[Link to Article](${data.assets.link})`)
					.addFields([
						{ name: 'Start Date', value: `<t:${data.time.startTimestamp}:f>`, inline: true },
						{
							name: 'End Date',
							value: `<t:${data.time.endTimestamp}:f>\nor <t:${data.time.endTimestamp}:R>`,
							inline: true,
						},
					])
					.setImage(data.assets.image)
					.setColor('2F3136')
					.setFooter({ text: 'Dates are formatted automatically for your timezone.' });

				const postEvent = new EmbedBuilder().setTitle('No Event Active').setDescription('No event is active or upcoming. Check back later for updates!').setColor('2F3136');

				const preEventCompact = new EmbedBuilder()
					.setTitle(`Countdown to ${data.name}`)
					.setURL(data.assets.link)
					.addFields([
						{ name: 'Start Date', value: `<t:${data.time.startTimestamp}:f>\nor <t:${data.time.startTimestamp}:R>`, inline: true },
						{
							name: 'End Date',
							value: `<t:${data.time.endTimestamp}:f>\nor <t:${data.time.endTimestamp}:R>`,
							inline: true,
						},
					])
					.setColor('2F3136')
					.setFooter({ text: 'Dates are formatted automatically for your timezone.' });

				const activeEventCompact = new EmbedBuilder()
					.setTitle(data.name)
					.setURL(data.assets.link)
					.setDescription(`[Link to News](${data.assets.link})`)
					.addFields([
						{ name: 'Start Date', value: `<t:${data.time.startTimestamp}:f>`, inline: true },
						{
							name: 'End Date',
							value: `<t:${data.time.endTimestamp}:f>\nor <t:${data.time.endTimestamp}:R>`,
							inline: true,
						},
					])
					.setColor('2F3136')
					.setFooter({ text: 'Dates are formatted automatically for your timezone.' });

				const postEventCompact = new EmbedBuilder()
					.setTitle('No Event Active')
					.setDescription('No event is active or upcoming. Check back later for updates!')
					.setColor('2F3136');

				// 0 = Pre-Event
				// 1 = Event Active
				// 2 = Event Passed
				if (compactEmbed(isCompact) == true) {
					if (data.time.activeState == 0) interaction.editReply({ embeds: [preEventCompact] });
					if (data.time.activeState == 1) interaction.editReply({ embeds: [activeEventCompact] });
					if (data.time.activeState == 2) interaction.editReply({ embeds: [postEventCompact] });
				} else if (compactEmbed(isCompact) == false) {
					if (data.time.activeState == 0) interaction.editReply({ embeds: [preEvent] });
					if (data.time.activeState == 1) interaction.editReply({ embeds: [activeEvent] });
					if (data.time.activeState == 2) interaction.editReply({ embeds: [postEvent] });
				}
			})
			.catch(error => {
				// Request failed with a response outside of the 2xx range
				if (error.response) {
					console.log(error.response.data);
					// console.log(error.response.status);
					// console.log(error.response.headers);

					interaction.editReply({ content: `**Error**\n\`${error.response.data.error}\``, embeds: [] });
				} else if (error.request) {
					console.log(error.request);
					interaction.editReply({
						content: `**Error**\n\`The request was not returned successfully.\``,
						embeds: [],
					});
				} else {
					console.log(error.message);
					interaction.editReply({
						content: `**Error**\n\`Unknown. Try again or tell SDCore#0001.\``,
						embeds: [],
					});
				}
			});
	},
};
