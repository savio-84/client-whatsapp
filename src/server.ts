/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import express from 'express';

const app = express();

let sessionConfig: any;

if (fs.existsSync(path.resolve(__dirname, 'session.json'))) {
  console.log('session config already exists, using it');
  sessionConfig = JSON.parse(String(fs.readFileSync(path.resolve(__dirname, 'session.json'))));
} else {
  console.log('Session config does not exists');
}

const client = new Client({ session: sessionConfig });
client.initialize();

client.on('qr', (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
});

client.on('disconnected', async () => {
  fs.unlink(path.resolve(__dirname, 'session.json'), () => {
    console.log('session file deleted');
  });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('authenticated', (session) => {
  if (!sessionConfig) {
    fs.writeFileSync(path.resolve(__dirname, 'session.json'), JSON.stringify(session));
    console.log('session file created');
  } else {
    console.log('server used saved session config');
  }
});

client.on('message', async (msg) => {
  if (msg.body === '!ping') {
    msg.reply('pong');
  }

  if (msg.body.toLowerCase().includes('bom dia')) {
    await client.sendMessage(msg.from, 'Bom dia!');
  }

  if (msg.body.toLowerCase().includes('boa tarde')) {
    await client.sendMessage(msg.from, 'Boa tarde!');
  }

  if (msg.body.toLowerCase().includes('boa noite')) {
    await client.sendMessage(msg.from, 'Boa noite!');
  }
});

app.listen(3333, () => {
  console.log('Server is running on port 3333');

  // adicionar os cron-jobs
});
