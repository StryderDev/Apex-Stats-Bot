const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('flashpoint').setDescription('Shows the current in-game FlashPoint map.'),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(`${Misc.Loading} Loading current in-game FlashPoint map...`).setColor('2F3136');

		await interaction.editReply({ embeds: [loadingEmbed] });

		const mapEmbed = new MessageEmbed()
			.setTitle(`Legends are currently auto-healing in\n**FlashPoint: Olympus**.`)
			.setDescription(`FlashPoint: Olympus ends <t:1651597200:R>, or at <t:1651597200:f>.`)
			.setColor('2F3136')
			.setImage(`https://cdn.apexstats.dev/Bot/Maps/Season12/FlashPoint/Olympus.png`);

		interaction.editReply({ embeds: [mapEmbed] });
	},
};
