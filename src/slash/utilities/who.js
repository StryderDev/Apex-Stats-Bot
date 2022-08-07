const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('who')
		.setDescription('Picks a random legend to play in-game.')
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('Category of legends to choose from.')
				.setRequired(false)
				.addChoices(
					{ name: 'Offensive', value: 'Offensive' },
					{ name: 'Defensive', value: 'Defensive' },
					{ name: 'Support', value: 'Support' },
					{ name: 'Recon', value: 'Recon' },
				),
		),
	async execute(interaction) {
		// Options
		const type = interaction.options.getString('type');

		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Choosing a random legend...`).setColor('2F3136');

		const legends = [
			'Bloodhound',
			'Gibraltar',
			'Lifeline',
			'Pathfinder',
			'Wraith',
			'Bangalore',
			'Caustic',
			'Mirage',
			'Octane',
			'Wattson',
			'Crypto',
			'Revenant',
			'Loba',
			'Rampart',
			'Horizon',
			'Fuse',
			'Valkyrie',
			'Seer',
			'Ash',
			'Mad Maggie',
			'Newcastle',
		];

		const offensive = ['Wraith', 'Bangalore', 'Mirage', 'Octane', 'Revenant', 'Horizon', 'Fuse', 'Ash', 'Mad Maggie'];

		const defensive = ['Gibraltar', 'Caustic', 'Wattson', 'Rampart', 'Newcastle'];

		const support = ['Lifeline', 'Loba'];

		const recon = ['Bloodhound', 'Pathfinder', 'Crypto', 'Valkyrie', 'Seer'];

		if (!type) {
			const legend = Math.floor(Math.random() * legends.length);
			const legendEmbed = new EmbedBuilder()
				.setDescription(`Play **${legends[legend]}** this round!`)
				.setImage(`https://cdn.jumpmaster.xyz/Bot/Legends/Banners/${encodeURIComponent(legends[legend])}.png`)
				.setColor('2F3136');

			await interaction.editReply({ embeds: [loadingEmbed] });
			await wait(1000);
			await interaction.editReply({ embeds: [legendEmbed] });
		} else {
			function legendType(type) {
				if (type == 'Offensive') return offensive;
				if (type == 'Defensive') return defensive;
				if (type == 'Support') return support;
				if (type == 'Recon') return recon;
			}

			const legend = Math.floor(Math.random() * legendType(type).length);
			const legendEmbed = new EmbedBuilder()
				.setDescription(`Play **${legendType(type)[legend]}** this round!`)
				.setImage(`https://cdn.jumpmaster.xyz/Bot/Legends/Banners/${encodeURIComponent(legendType(type)[legend])}.png`)
				.setColor('2F3136');

			await interaction.editReply({ embeds: [loadingEmbed] });
			await wait(1000);
			await interaction.editReply({ embeds: [legendEmbed] });
		}
	},
};
