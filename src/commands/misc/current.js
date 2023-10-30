const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { Misc, embedColor } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('current').setDescription('Information about the current season.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading current season data...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios.get('https://api.jumpmaster.xyz/seasons/Current?version=2').then(response => {
			const season = response.data;

			const currentSeason = new EmbedBuilder()
				.setTitle(`Apex Legends: ${season.info.title}`)
				.setURL(season.info.data.url)
				.setDescription(season.info.description)
				.addFields(
					{
						name: 'Season Start Date',
						value: `<t:${season.dates.start.timestamp}:D>\n<t:${season.dates.start.timestamp}:t>\n<t:${season.dates.start.timestamp}:R>`,
						inline: true,
					},
					{
						name: 'Season End Date',
						value: `<t:${season.dates.end.timestamp}:D>\n<t:${season.dates.end.timestamp}:t>\n<t:${season.dates.end.timestamp}:R>`,
						inline: true,
					},
					{
						name: 'Ranked End Date',
						value: `<t:${season.dates.end.rankedEnd}:D>\n<t:${season.dates.end.rankedEnd}:t>\n<t:${season.dates.end.rankedEnd}:R>`,
						inline: true,
					},
				)
				.setColor(embedColor)
				.setFooter({ text: season.info.data.tagline, iconURL: `https://cdn.jumpmaster.xyz/Bot/Avatar/${season.info.title}.png` });

			interaction.editReply({ embeds: [currentSeason] });
		});
	},
};
