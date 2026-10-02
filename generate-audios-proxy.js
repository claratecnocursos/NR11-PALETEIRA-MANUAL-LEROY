/**
 * Gera MP3 de narração via o proxy TecnoCursos
 * (https://texttospeech.escolatecnocursos.cloud), que chama a ElevenLabs.
 *
 * Login com AUTH_USERNAME / AUTH_PASSWORD do .env. Sem chave da ElevenLabs.
 *
 * Uso:
 *   node generate-audios-proxy.js
 *   node generate-audios-proxy.js home m1-cover
 *   node generate-audios-proxy.js --force home
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { buildManifest, writeManifest, MANIFEST_PATH, OUTPUT_DIR } = require('./audio-data');

const API_BASE = 'https://texttospeech.escolatecnocursos.cloud';
const JSON_UTF8 = 'application/json; charset=utf-8';

function loadEnvFile() {
  for (const filename of ['.env', '.env.local']) {
    const envPath = path.join(__dirname, filename);
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function login() {
  const res = await fetch(API_BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': JSON_UTF8 },
    body: JSON.stringify({
      username: process.env.AUTH_USERNAME,
      password: process.env.AUTH_PASSWORD
    })
  });
  if (!res.ok) {
    throw new Error('Login falhou (HTTP ' + res.status + ')');
  }
  const data = await res.json();
  if (!data || !data.token) throw new Error('Login não devolveu token');
  return data.token;
}

async function synthesize(text, token) {
  const res = await fetch(API_BASE + '/api/tts', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': JSON_UTF8
    },
    body: JSON.stringify({ text })
  });
  if (!res.ok) {
    throw new Error('TTS falhou (HTTP ' + res.status + ')');
  }
  return Buffer.from(await res.arrayBuffer());
}

async function synthesizeWithRetry(text, token) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const audio = await synthesize(text, token);
      if (!audio.length) throw new Error('resposta vazia');
      return audio;
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await sleep(1200 * attempt);
    }
  }
  throw lastErr;
}

async function main() {
  loadEnvFile();

  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const ids = args.filter((a) => !a.startsWith('--')).map((a) => a.replace(/^--slide=/, ''));

  if (!process.env.AUTH_USERNAME || !process.env.AUTH_PASSWORD) {
    console.error('Defina AUTH_USERNAME e AUTH_PASSWORD no .env');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const manifest = buildManifest();
  const pending = manifest.slides.filter((s) => !s.audioReady).map((s) => s.id);

  if (!ids.length) {
    console.log('Gere por partes. Informe os ids, por exemplo:');
    console.log('  node generate-audios-proxy.js home menu-1 menu-2 menu-3 menu-4 menu-done');
    console.log('  node generate-audios-proxy.js m3-quiz-intro m3-q1 m3-q2 m3-q3');
    console.log('');
    if (pending.length) {
      console.log('Ainda faltam ' + pending.length + ':');
      console.log('  ' + pending.join(' '));
    } else {
      console.log('Nenhum áudio pendente.');
    }
    writeManifest(manifest, MANIFEST_PATH);
    return;
  }

  const wanted = ids.map(function (id) {
    if (id === 'home') return 'home-nr01';
    if (id === 'menu-1') return 'menu-nr01-1';
    if (id === 'menu-2') return 'menu-nr01-2';
    if (id === 'menu-3') return 'menu-nr01-3';
    if (id === 'menu-4') return 'menu-nr01-4';
    if (id === 'menu-done') return 'menu-nr01-done';
    return id;
  });

  console.log('Autenticando no proxy...');
  const token = await login();
  console.log('Login ok.\n');

  let ok = 0;
  let fail = 0;
  let skip = 0;

  for (const id of wanted) {
    const slide = manifest.slides.find((s) => s.id === id);
    if (!slide) {
      console.error('· ' + id + ': não encontrado no manifesto');
      fail++;
      continue;
    }

    const outputPath = path.join(__dirname, slide.file);
    if (!force && fs.existsSync(outputPath) && slide.audioReady) {
      console.log('· ' + id + ': já existe, pulando');
      skip++;
      continue;
    }

    process.stdout.write('· ' + id + ' (' + slide.text.length + ' chars)... ');
    try {
      const audio = await synthesizeWithRetry(slide.text, token);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, audio);
      slide.audioReady = true;
      console.log('ok (' + (audio.length / 1024).toFixed(0) + ' KB)');
      ok++;
    } catch (error) {
      console.log('falhou');
      console.error('  ' + error.message);
      fail++;
    }
    await sleep(350);
  }

  const refreshed = buildManifest();
  writeManifest(refreshed, MANIFEST_PATH);
  console.log('\nPronto. Gerados: ' + ok + ' · pulados: ' + skip + ' · falhas: ' + fail);
  console.log('Manifesto: audios/manifest.json e audios/audio-manifest.js');
}

main().catch((error) => {
  console.error(error && error.message ? error.message : error);
  process.exit(1);
});
