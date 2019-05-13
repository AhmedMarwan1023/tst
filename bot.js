const Discord = require("discord.js")
const client = new Discord.Client()
const prefix = "*"
 
client.on('ready', () => {
console.log(`Online.`);
 });
 
 const SQLite = require('sqlite'); // SQLpackage
const path = require('path'); // PATHpackage
const invites = {}; //
 
client.on("ready", () => { // ready ?
    client.guilds.forEach(g => { // for each guilds ?
        g.fetchInvites().then(guildInvites => { // fetch invites ?
                invites[g.id] = guildInvites; // push guild invites on invites ^^
        }); // end
}); // end
}); // end
SQLite.open(path.join(__dirname, 'links.sql')) // read path ?
.then(() => { // then ?
    console.log('Opened') // seccussfull opened
    SQLite.run(`CREATE TABLE IF NOT EXISTS linkSysteme (code TEXT, id VARCHAR(30))`) // create table if not exisit
}) // end
.catch(err => console.error(err)) // on error
 
client.on("message", async msg => { // message ?
    if(msg.author.bot || !msg.channel.guild) return; // if bot or private return
    if(msg.content.startsWith("رابط")) { // message content
        let invite = await msg.channel.createInvite({ //  create invites
            maxAge: 86400, // one day // limit time for invite ^^
            maxUses: 5 // 5 people can enter // limit users for invites ^^
        }, `Requested by ${msg.author.tag}`).catch(console.log); // reason // end
       
        SQLite.run(`INSERT INTO linkSysteme VALUES ('${invite.code}','${msg.author.id}')`) // insert into table
        msg.author.send(invite ? /*seccussfull*/`**مدة الرابط : يـوم عدد استخدامات الرابط : 5 **:\n ${invite}` /*error catch*/: "يوجد خلل في البوت :( \n  يتم حل المشكل قريبا ...");
    }
 
})
 
let inv_room = "544475000158289920" // room id
client.on('guildMemberAdd', async member => { // membed add event
    member.guild.fetchInvites().then(async guildInvites => { // fetch invites ?
            const inv = invites[member.guild.id]; // get invite :)
            invites[member.guild.id] = guildInvites; // push guild invites on invites
            let invite = guildInvites.find(i => inv.get(i.code).uses < i.uses); // find ?
            let res = await SQLite.get(`SELECT * FROM linkSysteme WHERE code = '${invite.code}'`) // select from sql
            if(!res) { // if the code does'nt exists
            console.log(invite.code) // for test
            client.channels.get(inv_room).send("**Welcom To "+member.guild.name+"🌹 .\n       Joined By: "+invite.inviter+".**") // send message to welcome room
            } else { // if the code link exitst
                client.channels.get(inv_room).send("**Welcom To "+member.guild.name+"🌹 .\n       Joined By: <@!"+res.id+">.**") // send message to welcome room
                console.log(res.code) // for test
        } // end if
    }); // end fetchs :)
}); // end events :) ) )) ))  )) )) )) )) ) )) ))
 
client.login(process.env.BOT_TOKEN);
