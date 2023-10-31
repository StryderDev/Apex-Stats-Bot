const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { nextMapLength } = require('../../utilities/map.js');
const { embedColor, Misc } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('map').setDescription('Shows the current and next Battle Royale map rotation.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Grabbing map data from API...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.jumpmaster.xyz/map/?next=1&key=${process.env.SPYGLASS}`)
			.then(response => {
				const map = response.data.br;

				const mapEmbed = new EmbedBuilder()
					.setTitle(`Legends are currently dropping into ${map.map.name}`)
					.setDescription(
						`**${map.map.name}** ends <t:${map.times.next}:R> at <t:${map.times.next}:t>.\n**Next Up:** ${map.next[0].map.name} for ${nextMapLength(
							map.next[0].duration.minutes,
							map.next[0].duration.hours,
						)}.`,
					)
					.setImage(`https://cdn.jumpmaster.xyz/Bot/Maps/Season%2019/Battle%20Royale/${encodeURIComponent(map.map.image)}.png?t=${Math.floor(Math.random() * 10)}`)
					.setColor(embedColor);

				interaction.editReply({ embeds: [mapEmbed] });
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setTitle('Map Lookup Error').setDescription(error.response.data.error).setColor('D0342C').setTimestamp();

					axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=error&dev=${debug}`);

					interaction.editReply({ embeds: [errorEmbed] });
				} else if (error.request) {
					console.log(error.request);

					const errorEmbed = new EmbedBuilder()
						.setTitle('Site Lookup Error')
						.setDescription(`The request was not returned successfully.\nThis is potentially an error with the API.\nPlease try again shortly.`)
						.setColor('D0342C')
						.setTimestamp();

					interaction.editReply({ embeds: [errorEmbed] });
				} else {
					console.log(error.message);

					const errorEmbed = new EmbedBuilder()
						.setTitle('Unknown Error')
						.setDescription(`This should never happen.\nIf you see this error, please contact <@360564818123554836> ASAP.`)
						.setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
