const path = require('path');
const chalk = require('chalk');
const { ShardingManager } = require('discord.js');

// Load environment variables from .env file
require('dotenv').config();

// Require DB Config after dotenv is loaded
const db = require('./utilities/db.js');

// If bot is in dev mode, show that in the console
if (process.env.DEBUG === 'true') console.log(chalk.yellow(`${chalk.bold('[BOT]')} Bot started in debug environment`));

const shardManager = new ShardingManager(path.join(__dirname, 'apexstats.js'), { token: process.env.DISCORD_TOKEN, totalShards: 'auto' });

console.log(chalk.yellow(`${chalk.bold('[SHARD MANAGER]')} Creating bot shards...`));

shardManager.on(`shardCreate`, shard => {
	console.log(chalk.yellow(`${chalk.bold('[SHARD_' + shard.id + ']')} Shard ${shard.id} created`));
	console.log(chalk.green(`${chalk.bold('[SHARD_' + shard.id + ']')} Shard ${shard.id} launched`));

	// Create initial rows in database for logging
	// the map index for each shard
	console.log(chalk.yellow(`${chalk.bold('[SPYGLASS]')} Adding row for map index for Shard ${shard.id}...`));

	db.query('REPLACE INTO ApexStats_CurrentMapIndex (id, brMapIndex, rankedMapIndex) VALUES (?, 99, 99)', [shard.id], (err, row) => {
		if (err) return console.error(chalk.red(`${chalk.bold('[SHARD_' + shard.id + ']')} Error updating CurrentMapIndex: ${err.sqlMessage} for Shard ${shard.id}`));

		console.log(chalk.green(`${chalk.bold('[SPYGLASS]')} Updated CurrentMapIndex for Shard ${shard.id}`));
	});
});

shardManager.spawn().catch(err => {
	if (err.statusText) {
		return console.error(chalk.red(`${chalk.bold('[SHARD MANAGER]')} Error creating bot shards: ${err.statusText}`));
	} else {
		return console.error(chalk.red(`${chalk.bold('[SHARD MANAGER]')} Error creating bot shards: ${err}`));
	}
});
