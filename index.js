//-----Setting Up-----//
const { Client, Collection } = require("discord.js");
const { default_prefix } = require("./config.json")
const fetch = require("node-fetch");
const db = require("quick.db")
const moment = require("moment");
const { CanvasSenpai } = require("canvas-senpai")
const canva = new CanvasSenpai();
const { emotes, emoji } = require("./config.json")
const discord = require("discord.js");
//----Creating Client-----//
const client = new discord.Client({
  disableEveryone: false
});
//-----Varibles-----//
let token = process.env.token
let prefix = process.env.prefix
//-----Collection----//
client.commands = new discord.Collection();
client.aliases = new discord.Collection();
//----Command Handler----//
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
client.queue = new Map()
process.on('unhandledRejection', console.error);

client.on("message", async message => {


  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(default_prefix)) return;

  if (!message.member)
    message.member = message.guild.fetchMember(message);

  const args = message.content
    .slice(default_prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);
});
//----Prefix----//
const MessageEmbed = require ("discord.js") 
client.on('message', async (message) => {
  if(message.content.includes(client.user.id)) {
    const embed = new MessageEmbed()
    .setTitle(`I was Pinged?!`)
    .setDescription(`Hello, my prefix is \`${prefix}\` Use \`${prefix}help\` to see my commands!`)
    .setColor("PURPLE")
    .setFooter(`Thank you The Crazy for This Code`);
return message.channel.send(embed);
}
})


//-----Invite Tracker (One Guild)-----//
const { promisify } = require('util');

const wait = promisify(setTimeout);

let invites;

const id = '900378275791142962';

client.on('ready', async () => {
  await wait(2000);

  client.guilds.cache.get(id).fetchInvites().then(inv => {
    invites = inv;
  })
})

client.on('guildMemberAdd', async (member) => {
  if (member.guild.id !== id) return;

  member.guild.fetchInvites().then(gInvites => {
    const invite = gInvites.find((inv) => invites.get(inv.code).uses < inv.uses);

    const channel = member.guild.channels.cache.get(`900378276063756290`);

    channel.send(`╭・⌬・${member} Joined ${member.guild.name}\n╭┈──────────➤\n✰・Invited by ${invite.inviter}\n✰・and the code was ${invite.code}\n╰┈──────────➤\n╰・⌬・${member.guild.name} has now ${member.guild.memberCount} members`);
  })
})
//-----Welcome-----//
client.on("guildMemberAdd", async member => {

  let chx = db.get(`welchannel_${member.guild.id}`);

  if (chx === null) {

    return;

  }
  let data = await canva.welcome(member, { link: "https://cdn.discordapp.com/attachments/868174375810138154/875218024909656074/images.png", blur: false })
  const attachment = new discord.MessageAttachment(

    data,

    "Welcome.png"

  );
  client.channels.cache.get(chx).send(`Hey ${member.user},\n Welcome to ${member.guild.name}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n <:CEE2_Thanks:874613746805379112> ╎ Thanks for Joining\n <a:golden_arrow:849859656041103360> ╎ Read the Rules\n <:CEE2_Members:874615139440156672> ╎ Now we have ${member.guild.memberCount} Members!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n Have a Great Time!`, attachment);

});
//-----Leave-----//
client.on("guildMemberRemove", async member => {

  let chx = db.get(`Remchannel_${member.guild.id}`);

  if (chx === null) {

    return;

  }
  let data = await canva.welcome(member, { link: "https://cdn.discordapp.com/attachments/868174375810138154/875218024909656074/images.png", blur: false })
  const attachment = new discord.MessageAttachment(

    data,

    "Leave.png"

  );
  client.channels.cache.get(chx).send(`Ohno ${member.user} just left the server\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  <:CEE2_Members:874615139440156672> ╎ Now we have ${member.guild.memberCount} Members!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`, attachment);

});
//----Giveaways-----//
  const { GiveawaysManager } = require("discord-giveaways");
  const manager = new GiveawaysManager(client, {
    storage: "./handlers/giveaways.json",
    updateCountdownEvery: 10000,
    default: {
      botsCanWin: false,
      exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
      embedColor: "#FF0000",
      reaction: "🎉"
    }
  });
  
  client.giveawaysManager = manager;
//-----Prefix Setup-----//
  client.on("message", async message => {
    if (!message.guild) return;
    let prefix = db.get(`default_prefix${message.guild.id}`)
    if (prefix === null) prefix = default_prefix;

    if (!message.content.startsWith(default_prefix)) return;

  })
//-----Bot Status Type (dnd/online/idle)-----//
  client.on("ready", () => {
    client.user.setStatus("online");
  });
  client.on("message", async message => {
    if (!message.guild) return;
    let prefix = db.get(`prefix_${message.guild.id}`)
    if (prefix === null) prefix = default_prefix;

    if (!message.content.startsWith(prefix)) return;

  })
//-----Uptime Funcition-----//
  require('http').createServer((req, res) => res.end('CEE2 is alive!')).listen(3000)
//-----Bot Status-----//
  client.on
  client.on("ready", () => {
    client.user.setActivity(`${client.guilds.cache.size} Servers | c?help`, { type: "WATCHING" })
  })

//-----Music Player-----//
  const { Player } = require("discord-music-player");

  const player = new Player(client, {
    leaveOnEmpty: false,
  });

  client.player = player;

  new Player(client, {
    leaveOnEnd: false,
    leaveOnStop: false,
    leaveOnEmpty: false,
    timeout: 10,
    volume: 200,
    quality: 'high',
  });
//-----Bot Logs-----//
client.on('guildCreate', guild => {

    const channelId = '874610627946111026';

    const channel = client.channels.cache.get(channelId);
    if (!channel) return;
    const embed = new discord.MessageEmbed()
      .setTitle('I Joined A Guild!')
      .setDescription(`**Guild Name:** ${guild.name} (${guild.id})\n**Members:** ${guild.memberCount}`)
      .setTimestamp()
      .setColor('RANDOM')
      .setFooter(`I'm in ${client.guilds.cache.size} Guilds Now!`);
    channel.send(embed);
  });


  client.on('guildDelete', guild => {
    const channelId = '874610627946111026';
    const channel = client.channels.cache.get(channelId);

    if (!channel) return; 
    const embed = new discord.MessageEmbed()
      .setTitle('I Left A Guild!')
      .setDescription(`**Guild Name:** ${guild.name} (${guild.id})\n**Members:** ${guild.memberCount}`)
      .setTimestamp()
      .setColor('RED')
      .setFooter(`I'm in ${client.guilds.cache.size} Guilds Now!`);
    channel.send(embed);
    })
//-----Bot Load Status-----//
console.log(`Logged in as CEE2`);
console.log(`Prefix: ${prefix}`);
console.log(`${client.commands.size} Commands Loaded!`)

//-----Login (Using Env for Protection)-----//
client.login(process.env.token);