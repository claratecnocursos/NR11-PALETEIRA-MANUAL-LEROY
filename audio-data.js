/**
 * Manifesto de narração a partir de question-screen-data.js.
 *
 *   node audio-data.js
 *   const { buildManifest } = require('./audio-data');
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const T = require('./narration-text.js');

const ROOT = __dirname;
const OUTPUT_DIR = path.join(ROOT, 'audios');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');
const DATA_FILE = path.join(ROOT, 'question-screen-data.js');

function ttsSpeak(text) {
  if (!text) return '';
  let t = String(text);
  t = t.replace(/[\u2014\u2013]/g, ', ');
  t = t.replace(/\bNR[-\s]?12\b/gi, 'N R doze');
  t = t.replace(/\bNR[-\s]?11\b/gi, 'N R onze');
  t = t.replace(/\bNR[-\s]?01\b/gi, 'N R zero um');
  t = t.replace(/\bNR[-\s]?1\b/gi, 'N R um');
  t = t.replace(/\bSESMT\b/g, 'S E S M T');
  t = t.replace(/\bCIPA\b/g, 'C I P A');
  t = t.replace(/\bPCMSO\b/g, 'P C M S O');
  t = t.replace(/\bSSO\b/g, 'S S O');
  t = t.replace(/\bASO\b/g, 'A S O');
  t = t.replace(/\bASA\b/g, 'A S A');
  t = t.replace(/\bACA\b/g, 'A C A');
  t = t.replace(/\bMoki\b/g, 'Móqui');
  t = t.replace(/\bServiceNow\b/g, 'Sérvice Náu');
  t = t.replace(/\bADEO\b/g, 'A D E O');
  t = t.replace(/\bMDF\b/g, 'M D F');
  t = t.replace(/\bHQs\b/g, 'agá quês');
  t = t.replace(/\bHQ\b/g, 'agá quê');
  t = t.replace(/\bFDS\b/g, 'F D S');
  t = t.replace(/\b0800\s*940\s*1265\b/g, 'zero oitocentos, nove quatro zero, um dois seis cinco');
  t = t.replace(/\b0800\s*770\s*2324\b/g, 'zero oitocentos, sete sete zero, dois três dois quatro');
  t = t.replace(/\bEPIs\b/g, 'E P Is');
  t = t.replace(/\bEPI\b/g, 'E P I');
  t = t.replace(/\bLOTO\b/g, 'L O T O');
  t = t.replace(/\bGLP\b/g, 'G L P');
  t = t.replace(/\bINMETRO\b/g, 'I N M E T R O');
  t = t.replace(/100%/g, 'cem por cento');
  t = t.replace(/\b50\s*[×xX]\s*200\s*mm\b/gi, 'cinquenta por duzentos milímetros');
  t = t.replace(/\b850\s*mm\b/gi, 'oitocentos e cinquenta milímetros');
  t = t.replace(/\b120\s*mm\b/gi, 'cento e vinte milímetros');
  t = t.replace(/\b80\s*mm\b/gi, 'oitenta milímetros');
  t = t.replace(/\b200\s*mm\b/gi, 'duzentos milímetros');
  t = t.replace(/\b50\s*[×xX]\s*50\s*cm\b/gi, 'cinquenta por cinquenta centímetros');
  t = t.replace(/\b60\s*[×xX]\s*60\s*cm\b/gi, 'sessenta por sessenta centímetros');
  t = t.replace(/\b60\s*a\s*100\s*cm\b/gi, 'sessenta a cem centímetros');
  t = t.replace(/\b12\.11\.3\b/g, 'doze ponto onze ponto três');
  t = t.replace(/\b12\.5\.1\.1\b/g, 'doze ponto cinco ponto um ponto um');
  t = t.replace(/\b12\.5\.15\b/g, 'doze ponto cinco ponto quinze');
  t = t.replace(/\b12\.5\.14\b/g, 'doze ponto cinco ponto quatorze');
  t = t.replace(/\b12\.5\.13\b/g, 'doze ponto cinco ponto treze');
  t = t.replace(/\b12\.5\.9\b/g, 'doze ponto cinco ponto nove');
  t = t.replace(/\b12\.5\.8\b/g, 'doze ponto cinco ponto oito');
  t = t.replace(/\b12\.5\.7\b/g, 'doze ponto cinco ponto sete');
  t = t.replace(/\b12\.5\.6\b/g, 'doze ponto cinco ponto seis');
  t = t.replace(/\b12\.5\.4\b/g, 'doze ponto cinco ponto quatro');
  t = t.replace(/\b12\.5\.3\b/g, 'doze ponto cinco ponto três');
  t = t.replace(/\bISO\s*12100\b/gi, 'I S O doze mil e cem');
  t = t.replace(/\bIEC\s*60204-1\b/gi, 'I E C sessenta mil duzentos e quatro hífen um');
  t = t.replace(/\bNBR\s*14153\b/gi, 'N B R quatorze mil cento e cinquenta e três');
  t = t.replace(/\bABNT\b/g, 'A B N T');
  t = t.replace(/\b4 perguntas\b/gi, 'quatro perguntas');
  t = t.replace(/\b5 casos\b/gi, 'cinco casos');
  t = t.replace(/\b5 perguntas\b/gi, 'cinco perguntas');
  t = t.replace(/\b3 afirmações\b/gi, 'três afirmações');
  t = t.replace(/\bmínimo\s+3\b/gi, 'mínimo três');
  t = t.replace(/\bmínimo\s+4\b/gi, 'mínimo quatro');
  t = t.replace(/\bmínimo\s+2\b/gi, 'mínimo dois');
  t = t.replace(/\b50 pontos\b/gi, 'cinquenta pontos');
  t = t.replace(/\bquatro módulos\b/gi, 'quatro módulos');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

/** Textos falados (já no jeito da voz). Fonte UTF-8. */
const RAW_OVERRIDES = {
  'home-nr01':
    'Segurança do Trabalho. N R zero um, Manual de Integração e Segurança do Trabalho. Cultura de segurança, Regras de Ouro, emergências, E P Is e práticas em loja e depósito. Quatro módulos completos. Treinamento cem por cento online.',

  'menu-nr01-1':
    'N R zero um, Manual de Integração e Segurança do Trabalho. Um módulo por vez. Ao concluir, o próximo é liberado. Módulo um de quatro, Fundamentos da Segurança, Cultura Organizacional, Regras de Ouro e Gestão de Riscos, N R um. Toque em iniciar módulo.',
  'menu-nr01-2':
    'N R zero um, Manual de Integração e Segurança do Trabalho. Um módulo por vez. Ao concluir, o próximo é liberado. Módulo dois de quatro, Gestão de Ocorrências, Emergências, Incêndios e Saúde Ocupacional. Toque em iniciar módulo.',
  'menu-nr01-3':
    'N R zero um, Manual de Integração e Segurança do Trabalho. Um módulo por vez. Ao concluir, o próximo é liberado. Módulo três de quatro, Equipamentos de Proteção, Ferramentas Manuais e Práticas Seguras em Loja e Depósito. Toque em iniciar módulo.',
  'menu-nr01-4':
    'N R zero um, Manual de Integração e Segurança do Trabalho. Um módulo por vez. Ao concluir, o próximo é liberado. Módulo quatro de quatro, Equipamentos Móveis Motorizados, Estruturas de Armazenamento, Escadas e Isolamento. Toque em iniciar módulo.',
  'menu-nr01-done':
    'N R zero um, Manual de Integração e Segurança do Trabalho. Um módulo por vez. Ao concluir, o próximo é liberado. Treinamento concluído. Você pode revisar o módulo um.'
};


const NARRATION_OVERRIDES = {};
Object.keys(RAW_OVERRIDES).forEach((key) => {
  NARRATION_OVERRIDES[key] = ttsSpeak(RAW_OVERRIDES[key]);
});

function loadSession() {
  const src = fs.readFileSync(DATA_FILE, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'question-screen-data.js' });
  const session = sandbox.window.QUESTION_SCREEN_SESSION;
  if (!session) throw new Error('não encontrei QUESTION_SCREEN_SESSION');
  return session;
}

function catalogEntries(session) {
  const entries = [
    { id: T.HOME_KEY, title: 'Abertura' },
    { id: T.menuAudioKey(1), title: 'Menu, módulo 1' },
    { id: T.menuAudioKey(2), title: 'Menu, módulo 2' },
    { id: T.menuAudioKey(3), title: 'Menu, módulo 3' },
    { id: T.menuAudioKey(4), title: 'Menu, módulo 4' },
    { id: T.menuAudioKey(0), title: 'Menu, concluído' }
  ];
  (session.modules || []).forEach((mod) => {
    (mod.screens || []).forEach((screen) => {
      if (screen && screen.id) {
        entries.push({
          id: screen.id,
          title: screen.title || screen.question || screen.id,
          screen
        });
      }
    });
  });
  return entries;
}

function fallbackText(session, entry) {
  if (entry.id === T.HOME_KEY) return T.buildHomeText();
  if (entry.id === T.menuAudioKey(0) || entry.id === 'menu-nr01-done') return T.buildMenuText(session, 0);
  const menuMatch = /^menu-nr01-(\d+)$/.exec(entry.id);
  if (menuMatch) return T.buildMenuText(session, Number(menuMatch[1]));
  if (entry.screen) return T.buildScreenText(entry.screen);
  return '';
}

function buildManifest() {
  const session = loadSession();
  const entries = catalogEntries(session);

  const slides = entries.map((entry, index) => {
    let text = NARRATION_OVERRIDES[entry.id];
    if (!text) text = ttsSpeak(fallbackText(session, entry));
    if (!text) text = ttsSpeak(entry.title || entry.id);

    const fileName = T.audioFileName(entry.id);
    return {
      index,
      id: entry.id,
      title: String(entry.title || entry.id).replace(/<[^>]*>/g, ''),
      file: 'audios/' + fileName,
      text,
      audioReady: fs.existsSync(path.join(OUTPUT_DIR, fileName))
    };
  });

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: 'question-screen-data.js',
    audioDir: 'audios',
    slides
  };
}

function writeManifest(manifest, outputPath = MANIFEST_PATH) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  const jsPath = path.join(path.dirname(outputPath), 'audio-manifest.js');
  fs.writeFileSync(
    jsPath,
    'window.__AUDIO_NARRATION__ = ' + JSON.stringify(manifest, null, 2) + ';\n',
    'utf8'
  );
  return outputPath;
}

if (require.main === module) {
  const manifest = buildManifest();
  const out = writeManifest(manifest);
  console.log('Manifesto gerado: ' + out);
  console.log(manifest.slides.length + ' telas.');
  manifest.slides.forEach((slide) => {
    console.log('  ' + slide.id + ' (' + slide.text.length + ' chars)');
  });
}

module.exports = {
  MANIFEST_PATH,
  OUTPUT_DIR,
  NARRATION_OVERRIDES,
  ttsSpeak,
  buildManifest,
  writeManifest
};
