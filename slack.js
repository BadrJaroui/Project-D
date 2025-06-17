require("dotenv").config(); // dit zorgt ervoor dat we de .env file kunnen gebruiken voor onze secrets zoals token en signing secret
const { App } = require("@slack/bolt");   //dit is de slack sdk voor het bouwen van slackapps
//const fetch = require("node-fetch"); // dit gebruiken we om HTTP aanvragen te sturen naar onze eigen backend (route.js API)

//node-fetch word niet supported met lagere versie, moet node v18 zijn dus gebruik voor nuu deze lijn hieronder 
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const app = new App({
  token: process.env.SLACK_BOT_TOKEN,  // onze unieke bot token
  signingSecret: process.env.SLACK_SIGNING_SECRET, // onze unieke signing secret die we hebben gekregen van slack toen we de app aanmaakten (hiermee kunnen ibrekers geen false requests sturen)
});


// in deze functie sturen we de vraag van de user door naar onze eigen backend (localhost:3010/api/chat)
// Die backend stuurt de vraag door naar OpenWebUI (onze LLM die de echte antwoorden genereert)
// Als alles goed gaat krijgen we het antwoord terug als data.reply
async function sendToChatbot(message) {
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    return data.reply || "Geen antwoord ontvangen.";
  } catch (error) {
    console.error("Chatbot backend error:", error);
    return "Error: chatbot backend is niet bereikbaar.";
  }
}


// Als iemand onze bot vermeldt in een kanaal (@jouwbot vraag?), pikt dit event dat op
// De vraag wordt uit het bericht gefilterd zegmaar dus de vermelding met @ enzo worden verwijderd
// Het antwoord van onze chatbot wordt teruggestuurd naar hetzelfde kanaal met say()
app.event("app_mention", async ({ event, say }) => {
  const userMessage = event.text.replace(/<@[^>]+>/, "").trim(); // Verwijder bot tag
  const reply = await sendToChatbot(userMessage);
  await say(reply);
});



// Als iemand een direct message (DM) stuurt naar onze bot dan wordt dat in deze methode verwerkt
//Ook hier wordt het bericht doorgestuurd naar onze backend en het antwoord wordt teruggestuurd naar Slack
app.message(async ({ message, say }) => {     //Event Listeners van de Slack Events API.
  if (message.subtype === 'bot_message') return; 

  const reply = await sendToChatbot(message.text);
  await say(reply);
});



//de Slack app start op poort 3000(bij mij), zodat Slack events kan versturen naar onze lokale bot via een tunnel
 
(async () => {
  await app.start(3010);
  console.log("Slackbot draait op http://localhost:3010");
})();


// de stroom momenteel is: 
//  Slackbot -> nextsjs API (/api/chat) -> OpenWebUI (/api/chat/completions) -> terug via nextjs Antwoord terug naar Slack
