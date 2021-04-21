const {Discord} = require("../ApexStats.js");
const axios = require("axios");
const config = require("../config.json");

var UpEmoji = "<:StatusUp:786800700533112872>";
var SlowEmoji = "<:StatusSlow:786800700541501461>";
var DownEmoji = "<:StatusDown:786800700201238570>";
var NoDataEmoji = "<:StatusNoData:786800700499034122>";

module.exports = {
  name: "status",
  description: "Apex Legends server status.",
  execute(message) {
    message.channel.send("Retrieving server status...").then(async (msg) => {
      statusURL = `https://api.mozambiquehe.re/servers?auth=${config.MozambiqueAPI}`;
      announcementURL = `https://apexlegendsstatus.com/anno.json`;

      var status = axios.get(statusURL);
      var announcement = axios.get(announcementURL);

      axios.all([status, announcement]).then(
        axios.spread((...responses) => {
          var announcementResponse = responses[1].data;

          function getStatus(status) {
            if (status == "UP") {
              return UpEmoji;
            } else if (status == "SLOW") {
              return SlowEmoji;
            } else if (status == "DOWN") {
              return DownEmoji;
            } else if (status == "OVERLOADED") {
              return DownEmoji;
            } else {
              return NoDataEmoji;
            }
          }

          var originResult = responses[0].data["Origin_login"];
          var novaResult = responses[0].data["EA_novafusion"];
          var accountsResult = responses[0].data["EA_accounts"];
          var OauthSteam = responses[0].data["ApexOauth_Steam"];
          var OauthCrossplay = responses[0].data["ApexOauth_Crossplay"];

          const statusEmbed = new Discord.MessageEmbed()
            .setTitle("Apex Legends Server Status")
            .setColor("C21D27")
            .setDescription(`:bell: ${announcementResponse.Content}`)
            .addField(
              "Origin Login",
              `${getStatus(originResult["EU-West"].Status)}EU West (${
                originResult["EU-West"].ResponseTime
              }ms)\n${getStatus(originResult["EU-East"].Status)}EU East (${
                originResult["EU-East"].ResponseTime
              }ms)\n${getStatus(originResult["US-West"].Status)}US West (${
                originResult["US-West"].ResponseTime
              }ms)\n${getStatus(originResult["US-Central"].Status)}US Central (${
                originResult["US-Central"].ResponseTime
              }ms)\n${getStatus(originResult["US-East"].Status)}US East (${
                originResult["US-East"].ResponseTime
              }ms)\n${getStatus(originResult["SouthAmerica"].Status)}South America (${
                originResult["SouthAmerica"].ResponseTime
              }ms)\n${getStatus(originResult["Asia"].Status)}Asia (${
                originResult["Asia"].ResponseTime
              }ms)`,
              true
            )
            .addField(
              "[Crossplay] Apex Login",
              `${getStatus(OauthCrossplay["EU-West"].Status)}EU West (${
                OauthCrossplay["EU-West"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["EU-East"].Status)}EU East (${
                OauthCrossplay["EU-East"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["US-West"].Status)}US West (${
                OauthCrossplay["US-West"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["US-Central"].Status)}US Central (${
                OauthCrossplay["US-Central"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["US-East"].Status)}US East (${
                OauthCrossplay["US-East"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["SouthAmerica"].Status)}South America (${
                OauthCrossplay["SouthAmerica"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["Asia"].Status)}Asia (${
                OauthCrossplay["Asia"].ResponseTime
              }ms)`,
              true
            )
            .addField("\u200b", "\u200b", true)
            .addField(
              "EA Novafusion",
              `${getStatus(novaResult["EU-West"].Status)}EU West (${
                novaResult["EU-West"].ResponseTime
              }ms)\n${getStatus(novaResult["EU-East"].Status)}EU East (${
                novaResult["EU-East"].ResponseTime
              }ms)\n${getStatus(novaResult["US-West"].Status)}US West (${
                novaResult["US-West"].ResponseTime
              }ms)\n${getStatus(novaResult["US-Central"].Status)}US Central (${
                novaResult["US-Central"].ResponseTime
              }ms)\n${getStatus(novaResult["US-East"].Status)}US East (${
                novaResult["US-East"].ResponseTime
              }ms)\n${getStatus(novaResult["SouthAmerica"].Status)}South America (${
                novaResult["SouthAmerica"].ResponseTime
              }ms)\n${getStatus(novaResult["Asia"].Status)}Asia (${
                novaResult["Asia"].ResponseTime
              }ms)`,
              true
            )
            .addField(
              "EA Accounts",
              `${getStatus(accountsResult["EU-West"].Status)}EU West (${
                accountsResult["EU-West"].ResponseTime
              }ms)\n${getStatus(accountsResult["EU-East"].Status)}EU East (${
                accountsResult["EU-East"].ResponseTime
              }ms)\n${getStatus(accountsResult["US-West"].Status)}US West (${
                accountsResult["US-West"].ResponseTime
              }ms)\n${getStatus(accountsResult["US-Central"].Status)}US Central (${
                accountsResult["US-Central"].ResponseTime
              }ms)\n${getStatus(accountsResult["US-East"].Status)}US East (${
                accountsResult["US-East"].ResponseTime
              }ms)\n${getStatus(accountsResult["SouthAmerica"].Status)}South America (${
                accountsResult["SouthAmerica"].ResponseTime
              }ms)\n${getStatus(accountsResult["Asia"].Status)}Asia (${
                accountsResult["Asia"].ResponseTime
              }ms)`,
              true
            )
            .addField("\u200b", "\u200b", true)
            .setFooter("Data provided by https://apexlegendsstatus.com");

          msg.delete();
          msg.channel.send(statusEmbed);
        })
      );
    });
  },
};
