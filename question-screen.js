/**
 * QuestionScreen — componente reutilizável (vanilla JS)
 *
 * Tipos (JSON) — tudo DENTRO do cartão:
 *  - cover:    { type, title, subtitle?, image? }
 *  - content:  { type, kicker?, title, body?, bullets?, image?, cards?, stats?, items?, rules?, quote?, note?, compare? }
 *  - video:    { type, title, kicker?, duration?, scene?, brief?, video?, youtube?, image?/poster? }
 *  - image:    { type, title, kicker?, body?, bullets?, image, imageFit? }
 *  - quiz-intro: { type, title, body?, count?, minCorrect?, image? }
 *  - quiz-result: { type, passed, score, total, minCorrect, title?, titleUnlock? }
 *  - finale:   { type, title?, body?, eyebrow?, chips?, image?, kicker? }
 *  - reflect:  { type, prompt, answer, choices?[{icon,text}] }
 *  - compare:  { type, compare:[{ok,label,text}] }
 *  - order:    { type, items:[{key,text,rank}], time? }
 *  - match:    { type, pairs:[{ex,body}] }
 *  - sort:     { type, items:[{text,bin,hint?}], left:{id,label,icon}, right:{id,label,icon}, time? }
 *  - question: { type, question, alternatives[2..4], explanation?, image?, opinion? }
 *
 * video: se tiver `video` (mp4) ou `youtube` (id/url), toca o player;
 *        senão mostra o placeholder "Vídeo a gravar" (como no treinamento).
 */
(function (global) {
  'use strict';

  /* Vídeo: não pode pular nada e o avanço libera faltando 8s */
  var VIDEO_UNLOCK_MARGIN = 8;
  var VIDEO_SEEK_TOLERANCE = 0.15;
  var VIDEO_TICK_TOLERANCE = 0.55;

  // "0:45", "1:20:05" ou "até 1:30" -> segundos (fallback se o player não informar a duração)
  function parseClock(txt) {
    var m = String(txt || '').match(/(?:(\d+):)?(\d{1,2}):(\d{2})/);
    if (!m) return 0;
    if (m[1] != null) return (Number(m[1]) * 3600) + (Number(m[2]) * 60) + Number(m[3]);
    return (Number(m[2]) * 60) + Number(m[3]);
  }

  function unlockThreshold(duration) {
    if (!(duration > 0)) return Infinity;
    return duration > VIDEO_UNLOCK_MARGIN ? duration - VIDEO_UNLOCK_MARGIN : duration * 0.85;
  }

  var sfxCtx = null;
  function ensureSfx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!sfxCtx) sfxCtx = new AC();
    if (sfxCtx.state === 'suspended') {
      try { sfxCtx.resume(); } catch (e) {}
    }
    return sfxCtx;
  }

  var quizCorrectAudio = null;
  var quizWrongAudio = null;
  var QUIZ_CORRECT_SFX = encodeURI('assets/efeitos sonoros/correct-answer.mp3');
  var QUIZ_WRONG_SFX = encodeURI('assets/efeitos sonoros/OBJMisc-wrong_answer-Elevenlabs.mp3');

  function playQuizMp3(kind) {
    var isOk = kind === 'ok' || kind === 'correct';
    var src = isOk ? QUIZ_CORRECT_SFX : QUIZ_WRONG_SFX;
    try {
      ensureSfx();
      var audio = isOk ? quizCorrectAudio : quizWrongAudio;
      if (!audio) {
        audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = 0.45;
        if (isOk) quizCorrectAudio = audio;
        else quizWrongAudio = audio;
      }
      try {
        if (quizCorrectAudio && quizCorrectAudio !== audio) {
          quizCorrectAudio.pause();
          quizCorrectAudio.currentTime = 0;
        }
        if (quizWrongAudio && quizWrongAudio !== audio) {
          quizWrongAudio.pause();
          quizWrongAudio.currentTime = 0;
        }
      } catch (e) {}
      try {
        if (audio.readyState >= 1) audio.currentTime = 0;
      } catch (e2) {
        try { audio.load(); } catch (e3) {}
      }
      var p = audio.play();
      if (p && typeof p.then === 'function') {
        p.catch(function () { playBeepSynth(isOk ? 'ok' : 'nok'); });
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  function playBeepSynth(type) {
    var ctx = ensureSfx();
    if (!ctx) return;
    try {
      var now = ctx.currentTime;
      function beepNote(freq, t, dur, vol, wave, slideTo) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = wave || 'sine';
        osc.frequency.setValueAtTime(freq, now + t);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), now + t + dur);
        gain.gain.setValueAtTime(0.0001, now + t);
        gain.gain.exponentialRampToValueAtTime(vol, now + t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + dur + 0.02);
      }
      if (type === 'click' || type === 'flip') {
        beepNote(type === 'flip' ? 520 : 880, 0, 0.07, 0.08, 'sine', type === 'flip' ? 680 : 1240);
      } else if (type === 'ok' || type === 'correct') {
        beepNote(523.25, 0, 0.12, 0.16, 'sine');
        beepNote(659.25, 0.08, 0.12, 0.16, 'sine');
        beepNote(783.99, 0.16, 0.22, 0.16, 'sine');
      } else if (type === 'nok') {
        beepNote(320, 0, 0.28, 0.16, 'triangle', 140);
      } else if (type === 'end') {
        beepNote(523.25, 0, 0.16, 0.18, 'triangle');
        beepNote(659.25, 0.1, 0.16, 0.18, 'triangle');
        beepNote(783.99, 0.2, 0.18, 0.18, 'triangle');
        beepNote(1046.5, 0.34, 0.4, 0.2, 'triangle');
      } else {
        beepNote(800, 0, 0.07, 0.08, 'sine', 1200);
      }
    } catch (e) {}
  }

  function playBeep(type) {
    if (type === 'ok' || type === 'correct' || type === 'nok') {
      if (playQuizMp3(type === 'correct' ? 'ok' : type)) return;
    }
    playBeepSynth(type);
  }
  global.playBeep = playBeep;
  if (typeof document !== 'undefined') {
    var unlockSfx = function () {
      ensureSfx();
      document.removeEventListener('pointerdown', unlockSfx, true);
      document.removeEventListener('keydown', unlockSfx, true);
    };
    document.addEventListener('pointerdown', unlockSfx, true);
    document.addEventListener('keydown', unlockSfx, true);
  }

  function beep(type) {
    try { playBeep(type); } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function youtubeId(raw) {
    if (!raw) return '';
    var s = String(raw);
    if (/^[\w-]{11}$/.test(s)) return s;
    var m = s.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    return m ? m[1] : '';
  }

  function zoomIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>`;
  }

  function zoomChip(src, alt) {
    return `<span class="qs-zoom-fab" data-qs-zoom="${esc(src)}" data-qs-zoom-alt="${esc(alt || '')}" role="button" tabindex="0" aria-label="Ampliar imagem">${zoomIcon()}</span>`;
  }

  function mediaHTML(data, opts) {
    opts = opts || {};
    var fit = data.imageFit === 'contain' || opts.contain ? 'contain' : 'cover';
    if (data.image) {
      var pos = data.imagePosition
        ? ' style="object-position:' + esc(data.imagePosition) + ';transform-origin:' + esc(data.imagePosition) + '"'
        : '';
      var img = `<img class="qs-img qs-img-${fit}" src="${esc(data.image)}" alt="${esc(data.imageAlt || data.title || '')}"${pos} loading="eager" decoding="async" fetchpriority="high" onerror="this.classList.add('is-broken');this.nextElementSibling&&this.nextElementSibling.classList.add('show');">`;
      var fallback = `<div class="qs-media-fallback qs-img-fallback" aria-hidden="true">${esc(data.icon || '🖼️')}</div>`;
      if (opts.zoom === false) return img + fallback;
      return `<button type="button" class="qs-zoom-hit" data-qs-zoom="${esc(data.image)}" data-qs-zoom-alt="${esc(data.imageAlt || data.title || '')}" aria-label="Ampliar imagem">
        ${img}${fallback}
        <span class="qs-zoom-fab" aria-hidden="true">${zoomIcon()}</span>
      </button>`;
    }
    return `<div class="qs-media-fallback" aria-hidden="true">${esc(data.icon || '📘')}</div>`;
  }

  function pandaSrc(src) {
    var out = String(src || '');
    if (!out) return out;
    var sep = out.indexOf('?') === -1 ? '?' : '&';
    if (out.indexOf('saveProgress=') === -1) { out += sep + 'saveProgress=false'; sep = '&'; }
    if (out.indexOf('disableForward=') === -1) out += sep + 'disableForward=true';
    return out;
  }

  function playerHTML(data) {
    if (data.embed || data.panda) {
      var src = pandaSrc(data.embed || data.panda);
      var id = data.playerId || ('panda-' + Math.random().toString(36).slice(2, 10));
      return `<iframe id="${esc(id)}" class="qs-player qs-embed" data-qs-panda="1" src="${esc(src)}" title="${esc(data.title || 'Vídeo')}" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowfullscreen fetchpriority="high"></iframe>`;
    }
    if (data.video) {
      return `<video class="qs-player" controls playsinline preload="metadata" controlsList="nodownload noplaybackrate" disablepictureinpicture poster="${esc(data.poster || data.image || '')}" src="${esc(data.video)}"></video>`;
    }
    var yt = youtubeId(data.youtube);
    if (yt) {
      return `<iframe class="qs-player qs-yt" src="https://www.youtube.com/embed/${esc(yt)}?rel=0" title="${esc(data.title || 'Vídeo')}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    return '';
  }

  function videoHTML(data) {
    var live = playerHTML(data);
    var badge = data.duration ? `Vídeo a gravar · ${esc(data.duration)}` : 'Vídeo a gravar';
    if (data.video || data.youtube || data.embed || data.panda) {
      badge = data.duration ? `Vídeo · ${esc(data.duration)}` : 'Vídeo';
    }

    var stage = live
      ? `<div class="qs-video-stage">${live}</div>`
      : `<div class="qs-video-ph">
          <span class="qs-vbadge">${badge}</span>
          <div class="qs-vicon" aria-hidden="true">▶</div>
          <strong>${esc(data.scene || 'Cena a filmar')}</strong>
          <p>${esc(data.brief || data.body || '')}</p>
        </div>`;

    return `
      <article class="qs-screen is-video has-player" data-qs-root data-type="video">
        <header class="qs-video-head">
          <span class="qs-video-pill">${esc(data.kicker || '🎥 Vídeo')}</span>
          <h2 class="qs-video-title">${esc(data.title || '')}</h2>
        </header>
        <div class="qs-media qs-media-video">
          ${stage}
        </div>
      </article>`;
  }

  function imageHTML(data) {
    var bullets = Array.isArray(data.bullets) && data.bullets.length
      ? `<ul class="qs-bullets">${data.bullets.map(function (b) {
          return `<li>${esc(b)}</li>`;
        }).join('')}</ul>`
      : '';
    var body = data.body ? `<p class="qs-body">${esc(data.body)}</p>` : '';
    return `
      <article class="qs-screen is-image has-split" data-qs-root data-type="image">
        <div class="qs-media qs-media-split">
          ${mediaHTML(data, { contain: true })}
        </div>
        <div class="qs-panel qs-panel-split">
          <h2 class="qs-title">${esc(data.title || '')}</h2>
          ${body}
          ${bullets}
        </div>
      </article>`;
  }

  function coverHTML(data) {
    return `
      <article class="qs-screen is-cover" data-qs-root data-type="cover">
        <div class="qs-media">
          ${mediaHTML(data, { zoom: false })}
          <div class="qs-cover-labels">
            <h1>${esc(data.title || '')}</h1>
            ${data.subtitle ? `<p>${esc(data.subtitle)}</p>` : ''}
          </div>
        </div>
      </article>`;
  }

  function finaleHTML(data) {
    var chips = Array.isArray(data.chips) ? data.chips : [];
    var photo = data.image
      ? `<img class="qs-finale-photo" src="${esc(data.image)}" alt="" aria-hidden="true">`
      : '';
    var chipHtml = chips.map(function (c) {
      return `<span class="qs-finale-chip">${esc(c)}</span>`;
    }).join('');
    var quote = data.quote || data.motto || '';
    return `
      <article class="qs-screen is-finale" data-qs-root data-type="finale">
        ${photo}
        <div class="qs-finale-veil" aria-hidden="true"></div>
        <div class="qs-finale-glow" aria-hidden="true"></div>
        <div class="qs-finale-inner">
          ${data.kicker ? `<div class="qs-finale-kicker">${esc(data.kicker)}</div>` : ''}
          <div class="qs-finale-card medal-${esc(data.medalRank || 'none')}">
            <div class="qs-finale-shine" aria-hidden="true"></div>
            <div class="qs-finale-eyebrow">${esc(data.eyebrow || 'Certificado de conclusão')}</div>
            <div class="qs-finale-trophy" aria-hidden="true">${esc(data.medal || '🏆')}</div>
            ${data.medalName ? `<div class="qs-finale-medal-name">${esc(data.medalName)}</div>` : ''}
            <h2 class="qs-finale-title">${esc(data.title || 'Parabéns')}<span>!</span></h2>
            <div class="qs-finale-line" aria-hidden="true"></div>
            ${data.points != null ? `<div class="qs-finale-score">${esc(data.points)}<small> / ${esc(data.maxPoints != null ? data.maxPoints : '')} pts</small></div>` : ''}
            ${data.hits != null ? `<p class="qs-finale-hits">${esc(data.hits)} acertos em ${esc(data.questions != null ? data.questions : '')} questões</p>` : ''}
            <p class="qs-finale-body">${esc(data.body || data.subtitle || '')}</p>
            ${quote ? `<blockquote class="qs-finale-quote"><span aria-hidden="true">“</span>${esc(quote)}<span aria-hidden="true">”</span></blockquote>` : ''}
            ${chipHtml ? `<div class="qs-finale-chips">${chipHtml}</div>` : ''}
          </div>
        </div>
      </article>`;
  }

  function contentBlocks(data) {
    var html = '';
    if (data.body) html += `<p class="qs-body">${esc(data.body)}</p>`;
    if (Array.isArray(data.images) && data.images.length) {
      html += `<div class="qs-gallery">${data.images.map(function (img) {
        var src = typeof img === 'string' ? img : (img.image || img.src || '');
        var alt = typeof img === 'string' ? '' : (img.imageAlt || img.alt || img.caption || '');
        var cap = typeof img === 'string' ? '' : (img.caption || '');
        if (!src) return '';
        return `<figure class="qs-gallery-item">
          <button type="button" class="qs-zoom-hit" data-qs-zoom="${esc(src)}" data-qs-zoom-alt="${esc(alt)}" aria-label="Ampliar imagem">
            <img class="qs-img qs-img-contain" src="${esc(src)}" alt="${esc(alt)}" loading="eager" decoding="async">
            <span class="qs-zoom-fab" aria-hidden="true">${zoomIcon()}</span>
          </button>
          ${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}
        </figure>`;
      }).join('')}</div>`;
    }
    if (Array.isArray(data.stats) && data.stats.length) {
      html += `<div class="qs-stats">${data.stats.map(function (s) {
        return `<div class="qs-stat">
          ${s.icon ? `<span class="qs-stat-ico" aria-hidden="true">${esc(s.icon)}</span>` : ''}
          <div class="qs-stat-num">${esc(s.num || '')}</div>
          <div class="qs-stat-lbl">${esc(s.label || '')}</div>
        </div>`;
      }).join('')}</div>`;
    }
    if (Array.isArray(data.cards) && data.cards.length) {
      html += `<div class="qs-cards count-${data.cards.length}">${data.cards.map(function (c) {
        return `<article class="qs-card">
          ${c.icon ? `<div class="qs-card-ico" aria-hidden="true">${esc(c.icon)}</div>` : ''}
          ${c.title ? `<h3>${esc(c.title)}</h3>` : ''}
          ${c.body ? `<p>${esc(c.body)}</p>` : ''}
        </article>`;
      }).join('')}</div>`;
    }
    if (Array.isArray(data.items) && data.items.length) {
      html += `<div class="qs-items">${data.items.map(function (it) {
        var raw = it.text || it.body || '';

        /* Item numerado é passo de uma sequência, e nele a dose vem depois
           do travessão: "puxar palma para fora — 20 s cada lado, 3×". Em
           etiquetas, o tempo e as repetições saltam aos olhos sem obrigar
           a ler a frase inteira. Listas com ícone seguem como estavam:
           ali o travessão é pontuação, não separador de dose. */
        if (it.n != null) {
          var d = splitDose(raw);
          var doses = (d ? d.tags : []).map(function (t) {
            var rep = t.indexOf('×') !== -1;   // "3×" é repetição; "20 s" é tempo
            return `<span class="qs-dose ${rep ? 'is-rep' : 'is-time'}">${esc(t)}</span>`;
          }).join('');
          var thumb = it.image
            ? `<div class="qs-item-thumb"><img src="${esc(it.image)}" alt="${esc(it.imageAlt || it.title || '')}" loading="eager" decoding="async"></div>`
            : `<span class="qs-item-num">${esc(it.n)}</span>`;
          return `<div class="qs-item is-step${it.image ? ' has-thumb' : ''}">
            ${thumb}
            <div class="qs-item-txt">
              <div class="qs-item-head">
                <span class="qs-item-label">${it.n != null ? `<span class="qs-item-n">${esc(it.n)}</span>` : ''}${it.title ? `<b>${esc(it.title)}</b>` : ''}</span>
                ${doses ? `<span class="qs-doses">${doses}</span>` : ''}
              </div>
              <p>${esc(d ? d.move : raw)}</p>
              ${d && d.caveat ? `<span class="qs-item-warn">${esc(d.caveat)}</span>` : ''}
            </div>
          </div>`;
        }

        var mark = it.icon ? `<span class="qs-item-ico" aria-hidden="true">${esc(it.icon)}</span>` : '';
        var title = it.title ? `<b>${esc(it.title)}</b> ` : '';
        return `<div class="qs-item">${mark}<p>${title}${esc(raw)}</p></div>`;
      }).join('')}</div>`;
    }
    if (Array.isArray(data.compare) && data.compare.length) {
      html += `<div class="qs-compare">${data.compare.map(function (c) {
        var ok = !!c.ok;
        return `<article class="qs-compare-col ${ok ? 'is-ok' : 'is-bad'}">
          <div class="qs-compare-lbl">${esc(c.label || (ok ? '✓ Correto' : '✕ Evitar'))}</div>
          <p>${esc(c.text || c.body || '')}</p>
        </article>`;
      }).join('')}</div>`;
    }
    if (Array.isArray(data.bullets) && data.bullets.length) {
      html += `<ul class="qs-bullets">${data.bullets.map(function (b) {
        return `<li>${esc(b)}</li>`;
      }).join('')}</ul>`;
    }
    if (Array.isArray(data.rules) && data.rules.length) {
      html += `<div class="qs-rules">${data.rules.map(function (r) {
        return `<article class="qs-rule"><p>${esc(r.text || r.body || '')}</p></article>`;
      }).join('')}</div>`;
    }
    if (data.quote) html += `<blockquote class="qs-quote">${esc(data.quote)}</blockquote>`;
    if (data.note) {
      if (typeof data.note === 'object' && data.note) {
        html += `<aside class="qs-note qs-note-card">
          ${data.note.label ? `<strong class="qs-note-label">${esc(data.note.label)}</strong>` : ''}
          <span class="qs-note-text">${esc(data.note.text || data.note.body || '')}</span>
        </aside>`;
      } else {
        html += `<p class="qs-note">${esc(data.note)}</p>`;
      }
    }
    return html;
  }

  /* Separa o movimento da dose num passo de sequência. Devolve null quando
     não há travessão, e aí o texto segue inteiro — nada se perde se o
     conteúdo mudar de formato depois. Um aviso entre parênteses no fim sai
     da dose e vira linha própria, para não virar etiqueta. */
  function splitDose(text) {
    var i = String(text).indexOf('—');
    if (i < 0) return null;
    var move = text.slice(0, i).trim();
    var rest = text.slice(i + 1).trim();
    var caveat = '';
    var par = rest.match(/\(([^)]*)\)\s*$/);
    if (par) {
      caveat = par[1].trim();
      rest = rest.slice(0, par.index).trim();
    }
    var tags = rest.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!move || !tags.length) return null;
    return { move: move, tags: tags, caveat: caveat };
  }

  function hazardMapHTML(data) {
    var links = Array.isArray(data.links) ? data.links : [];
    var arrow = `<span class="qs-hazard-arrow" aria-hidden="true">
          <svg viewBox="0 0 52 24" fill="none">
            <path d="M4 12h36"/>
            <path d="M32 5l12 7-12 7"/>
          </svg>
        </span>`;
    var rows = links.map(function (it, i) {
      var perigo = it.perigo || '';
      var risco = it.risco || '';
      return `<button type="button" class="qs-hazard-row" data-qs-hazard="${i}" aria-label="Perigo: ${esc(perigo)}. Risco: ${esc(risco)}.">
        <span class="qs-hazard-cell is-danger">
          ${it.icon ? `<span class="qs-hazard-ico" aria-hidden="true">${esc(it.icon)}</span>` : ''}
          <span class="qs-hazard-copy">
            <span class="qs-hazard-tag">Perigo</span>
            <b>${esc(perigo)}</b>
          </span>
        </span>
        ${arrow}
        <span class="qs-hazard-cell is-risk">
          ${it.riscoIcon ? `<span class="qs-hazard-ico" aria-hidden="true">${esc(it.riscoIcon)}</span>` : ''}
          <span class="qs-hazard-copy">
            <span class="qs-hazard-tag">Risco</span>
            <b>${esc(risco)}</b>
          </span>
        </span>
      </button>`;
    }).join('');
    return `
      <article class="qs-screen is-content is-text is-hazard" data-qs-root data-type="content">
        <div class="qs-panel qs-panel-text qs-panel-hazard">
          <h2 class="qs-title">${esc(data.title || '')}</h2>
          ${data.body ? `<p class="qs-hazard-lead">${esc(data.body)}</p>` : ''}
          <div class="qs-hazard-legend">
            <span class="is-danger">Coluna do perigo</span>
            ${arrow}
            <span class="is-risk">Coluna do risco</span>
          </div>
          <div class="qs-hazard-map">${rows}</div>
          <p class="qs-hazard-caption" data-qs-hazard-cap>Toque em um par para ler a explicação.</p>
          ${data.quote ? `<blockquote class="qs-quote">${esc(data.quote)}</blockquote>` : ''}
        </div>
      </article>`;
  }

  /* Exploração por abas: o texto de cada ponto só aparece quando o aluno
     toca nele. Assim a tela cabe inteira, sem rolagem, e o conteúdo denso
     vira uma leitura de cada vez. */
  function exploreHTML(data) {
    var spots = Array.isArray(data.spots) ? data.spots : [];
    var first = spots[0] || {};
    var tabs = spots.map(function (s, i) {
      return `<button type="button" class="qs-explore-tab${i === 0 ? ' is-on' : ''}" data-qs-explore="${i}">
        ${s.icon ? `<span class="qs-explore-ico" aria-hidden="true">${esc(s.icon)}</span>` : ''}
        <span>${esc(s.tag || s.title || '')}</span>
      </button>`;
    }).join('');
    var dots = spots.map(function (_, i) {
      return `<span class="qs-explore-dot${i === 0 ? ' is-seen' : ''}" data-qs-explore-dot="${i}"></span>`;
    }).join('');
    return `
      <article class="qs-screen is-content is-text is-explore" data-qs-root data-type="content">
        <div class="qs-panel qs-panel-text qs-panel-explore">
          <h2 class="qs-title">${esc(data.title || '')}</h2>
          ${data.body ? `<p class="qs-explore-lead">${esc(data.body)}</p>` : ''}
          <div class="qs-explore-tabs">${tabs}</div>
          <div class="qs-explore-detail is-in" data-qs-explore-panel>
            <h3 data-qs-explore-title>${esc(first.title || '')}</h3>
            <p data-qs-explore-body>${esc(first.body || '')}</p>
          </div>
          <div class="qs-explore-foot">
            <span class="qs-explore-dots" aria-hidden="true">${dots}</span>
            <span class="qs-explore-count" data-qs-explore-count>1 de ${spots.length}</span>
          </div>
          ${data.quote ? `<blockquote class="qs-quote qs-explore-quote">${esc(data.quote)}</blockquote>` : ''}
        </div>
      </article>`;
  }

  /* Pilha de fotos: a de cima sai para o fim do baralho a cada toque. Uma
     imagem grande por vez ocupa a altura que sobra, sem rolagem. */
  function stackHTML(data) {
    var slides = Array.isArray(data.stack) ? data.stack : [];
    var cards = slides.map(function (s, i) {
      var src = s.image || '';
      var alt = s.imageAlt || s.caption || '';
      return `<button type="button" class="qs-stack-card" data-qs-stack="${i}" data-pos="${i}">
        <img src="${esc(src)}" alt="${esc(alt)}" draggable="false">
        ${src ? zoomChip(src, alt) : ''}
      </button>`;
    }).join('');
    var first = slides[0] || {};
    return `
      <article class="qs-screen is-content is-stack" data-qs-root data-type="content">
        <header class="qs-stack-head">
          <h2 class="qs-title">${esc(data.title || '')}</h2>
          ${data.body ? `<p class="qs-body">${esc(data.body)}</p>` : ''}
        </header>
        <div class="qs-stack-wrap">
          ${cards}
          <span class="qs-stack-tap" data-qs-stack-tap aria-hidden="true">
            <span class="qs-stack-tap-hand">
              <span class="qs-stack-tap-ring"></span>
              👆
            </span>
            <span class="qs-stack-tap-txt">Toque para trocar</span>
          </span>
        </div>
        <p class="qs-stack-cap" data-qs-stack-cap>${esc(first.caption || '')}</p>
        <div class="qs-stack-foot">
          <span class="qs-stack-hint" data-qs-stack-hint>Passando sozinho — toque para trocar na hora</span>
          <span class="qs-stack-count" data-qs-stack-count>1 de ${slides.length}</span>
        </div>
      </article>`;
  }

  function figureHTML(data) {
    // cards aqui viram faixas rasas, para a foto seguir sendo o assunto da tela
    var cards = Array.isArray(data.cards) ? data.cards : [];
    var chips = cards.length
      ? `<ul class="qs-figure-chips count-${cards.length}">${cards.map(function (c) {
          return `<li class="qs-figure-chip">
            <span class="qs-figure-chip-ico" aria-hidden="true">${esc(c.icon || '•')}</span>
            <b>${esc(c.title || '')}</b>
            ${c.body ? `<span>${esc(c.body)}</span>` : ''}
          </li>`;
        }).join('')}</ul>`
      : '';

    // `wide`: prancha panorâmica, que precisa aparecer inteira em vez de preencher
    var media = mediaHTML(data, { contain: true, zoom: !data.sensitive });
    if (data.sensitive) {
      media = `<div class="qs-sensitive" data-qs-sensitive>
        <div class="qs-sensitive-media">${media}</div>
        <div class="qs-sensitive-veil">
          <span class="qs-sensitive-pill">Aviso</span>
          <strong>Imagens fortes</strong>
          <p>Esta foto mostra lesões reais. Só revele se quiser ver.</p>
          <button type="button" class="qs-sensitive-btn" data-qs-reveal-img>Revelar</button>
        </div>
      </div>`;
    }
    return `
      <article class="qs-screen is-content is-figure${data.wide ? ' is-wide' : ''}${chips ? ' has-chips' : ''}${data.sensitive ? ' is-sensitive' : ''}" data-qs-root data-type="content">
        <header class="qs-figure-head">
          <h2 class="qs-title">${esc(data.title || '')}</h2>
          ${data.body ? `<p class="qs-body">${esc(data.body)}</p>` : ''}
        </header>
        <div class="qs-figure-media">
          ${media}
        </div>
        ${chips}
        ${data.quote ? `<blockquote class="qs-quote qs-figure-quote">${esc(data.quote)}</blockquote>` : ''}
      </article>`;
  }

  function goldenHTML(data) {
    var cards = Array.isArray(data.cards) ? data.cards : [];
    var first = String((cards[0] && cards[0].icon) || '1').padStart(2, '0');
    var last = String((cards[cards.length - 1] && cards[cards.length - 1].icon) || cards.length).padStart(2, '0');
    var rules = cards.map(function (c, i) {
      var n = String(c.icon || (i + 1)).padStart(2, '0');
      return `<article class="qs-gold-rule" style="--i:${i}">
        <span class="qs-gold-num" aria-hidden="true">${esc(n)}</span>
        <div class="qs-gold-txt">
          ${c.title ? `<h3>${esc(c.title)}</h3>` : ''}
          ${c.body ? `<p>${esc(c.body)}</p>` : ''}
        </div>
      </article>`;
    }).join('');
    return `
      <article class="qs-screen is-content is-golden" data-qs-root data-type="content">
        <div class="qs-gold">
          <header class="qs-gold-head">
            <div class="qs-gold-head-top">
              <span class="qs-gold-pill">Regras de Ouro</span>
              <span class="qs-gold-range">${esc(first)} — ${esc(last)}</span>
            </div>
            <h2 class="qs-title">${esc(data.title || '')}</h2>
            ${data.body ? `<p class="qs-gold-lead">${esc(data.body)}</p>` : ''}
          </header>
          <div class="qs-gold-list count-${cards.length}">${rules}</div>
          ${data.quote ? `<p class="qs-gold-foot">${esc(data.quote)}</p>` : ''}
        </div>
      </article>`;
  }

  function qualifyHTML(data) {
    var picks = Array.isArray(data.picks) ? data.picks : [];
    var first = picks[0] || {};
    var steps = picks.map(function (p, i) {
      return `<button type="button" class="qs-qualify-step${i === 0 ? ' is-on is-seen' : ''}" data-qs-qualify="${i}">
        <span class="qs-qualify-n">${esc(p.n || String(i + 1).padStart(2, '0'))}</span>
        ${p.icon ? `<span class="qs-qualify-ico" aria-hidden="true">${esc(p.icon)}</span>` : ''}
        <strong>${esc(p.title || '')}</strong>
        ${p.lead ? `<em>${esc(p.lead)}</em>` : ''}
        <span class="qs-qualify-tick" aria-hidden="true">✓</span>
      </button>`;
    }).join('');
    var points = (first.points || []).map(function (pt) {
      return `<li>${esc(pt)}</li>`;
    }).join('');
    return `
      <article class="qs-screen is-content is-text is-qualify" data-qs-root data-type="content">
        <div class="qs-panel qs-panel-text">
          <header class="qs-qualify-head">
            <span class="qs-qualify-pill">${esc(data.kicker || 'Requisitos')}</span>
            <h2 class="qs-title">${esc(data.title || '')}</h2>
            ${data.body ? `<p class="qs-body">${esc(data.body)}</p>` : ''}
          </header>
          <div class="qs-qualify-meter" aria-hidden="true"><i data-qs-qualify-bar></i></div>
          <div class="qs-qualify-steps">${steps}</div>
          <div class="qs-qualify-detail is-in" data-qs-qualify-panel>
            <span class="qs-qualify-tag" data-qs-qualify-tag>Requisito ${esc(first.n || '01')}</span>
            <h3 data-qs-qualify-title>${esc(first.title || '')}</h3>
            <p data-qs-qualify-body>${esc(first.body || '')}</p>
            <ul data-qs-qualify-points>${points}</ul>
          </div>
          <p class="qs-qualify-done" data-qs-qualify-done hidden>Os três requisitos estão conferidos. Com saúde, treino e reciclagem em dia, a pessoa pode operar.</p>
        </div>
      </article>`;
  }

  function contentHTML(data) {
    if (data.layout === 'qualify') {
      return qualifyHTML(data);
    }
    if (data.layout === 'golden') {
      return goldenHTML(data);
    }
    if (Array.isArray(data.links) && data.links.length) {
      return hazardMapHTML(data);
    }
    if (Array.isArray(data.spots) && data.spots.length) {
      return exploreHTML(data);
    }
    if (Array.isArray(data.stack) && data.stack.length) {
      return stackHTML(data);
    }
    if (data.layout === 'figure' && data.image) {
      return figureHTML(data);
    }
    var hasImg = !!data.image;
    var rulesCount = Array.isArray(data.rules) ? data.rules.length : 0;
    var normCompact = !!(data.compact || (hasImg && rulesCount > 0));

    /* Sequência com foto: um exercício por vez, em vez da lista densa.
       A ficha de alongamento usa isso — a foto grande ensina o movimento. */
    if (data.steps && Array.isArray(data.items) && data.items.length) {
      return stepsHTML(data);
    }

    var head = `<h2 class="qs-title">${esc(data.title || '')}</h2>
          ${contentBlocks(data)}`;
    if (hasImg) {
      var extra = '';
      if (normCompact) extra += ' is-norm-compact';
      if (rulesCount >= 4) extra += ' is-norm-rules';
      if (Array.isArray(data.stats) && data.stats.length) extra += ' is-norm-stats';
      return `
      <article class="qs-screen is-content has-split${extra}" data-qs-root data-type="content">
        <div class="qs-media qs-media-split">
          ${mediaHTML(data)}
        </div>
        <div class="qs-panel qs-panel-split">
          ${head}
        </div>
      </article>`;
    }
    var dense = (data.items && data.items.length > 6) || (data.cards && data.cards.length > 3) || (data.images && data.images.length > 1);
    var hasGallery = !!(data.images && data.images.length);
    var fit = !!data.fit;
    return `
      <article class="qs-screen is-content is-text${dense ? ' is-dense' : ''}${hasGallery ? ' is-gallery' : ''}${fit ? ' is-fit' : ''}" data-qs-root data-type="content">
        <div class="qs-panel qs-panel-text">
          ${head}
        </div>
      </article>`;
  }

  function stepsHTML(data) {
    var items = data.items || [];
    var slides = items.map(function (it, i) {
      var raw = it.text || it.body || '';
      var d = splitDose(raw);
      var doses = (d ? d.tags : []).map(function (t) {
        var rep = t.indexOf('×') !== -1;
        return `<span class="qs-dose ${rep ? 'is-rep' : 'is-time'}">${esc(t)}</span>`;
      }).join('');
      var num = it.n != null ? it.n : (i + 1);
      return `<div class="qs-step${i === 0 ? ' is-on' : ''}" data-qs-step="${i}"${i === 0 ? '' : ' hidden'}>
        <div class="qs-step-media">
          ${it.image
            ? `<button type="button" class="qs-zoom-hit" data-qs-zoom="${esc(it.image)}" data-qs-zoom-alt="${esc(it.imageAlt || it.title || '')}" aria-label="Ampliar imagem">
                <img class="qs-step-img" src="${esc(it.image)}" alt="${esc(it.imageAlt || it.title || '')}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async">
                <span class="qs-zoom-fab" aria-hidden="true">${zoomIcon()}</span>
              </button>`
            : `<div class="qs-step-fallback">${esc(num)}</div>`}
        </div>
        <div class="qs-step-info">
          <div class="qs-step-head">
            <span class="qs-step-num">${esc(num)}</span>
            ${it.title ? `<b class="qs-step-title">${esc(it.title)}</b>` : ''}
            ${doses ? `<span class="qs-doses">${doses}</span>` : ''}
          </div>
          <p class="qs-step-move">${esc(d ? d.move : raw)}</p>
          ${d && d.caveat ? `<span class="qs-item-warn">${esc(d.caveat)}</span>` : ''}
        </div>
      </div>`;
    }).join('');

    return `
      <article class="qs-screen is-content is-steps" data-qs-root data-type="content">
        <div class="qs-steps" data-qs-steps>
          <header class="qs-steps-top">
            <h2 class="qs-title">${esc(data.title || '')}</h2>
            <span class="qs-steps-count" data-qs-step-count>Exercício 1 de ${items.length}</span>
          </header>
          <div class="qs-steps-track">${slides}</div>
          <div class="qs-steps-actions">
            <button type="button" class="qs-step-back" data-qs-step-prev hidden>Ver anterior</button>
            <button type="button" class="qs-step-cta" data-qs-step-next>
              Próximo exercício
            </button>
          </div>
        </div>
      </article>`;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function shuffleMixedBins(arr) {
    var a = shuffle(arr);
    var i, j, t, guard;
    function hasTriple() {
      for (i = 0; i < a.length - 2; i++) {
        if (a[i] && a[i + 1] && a[i + 2] && a[i].bin === a[i + 1].bin && a[i].bin === a[i + 2].bin) return i;
      }
      return -1;
    }
    for (guard = 0; guard < 50; guard++) {
      var at = hasTriple();
      if (at < 0) break;
      var swapped = false;
      for (j = 0; j < a.length; j++) {
        if (Math.abs(j - (at + 2)) < 1) continue;
        if (a[j] && a[j].bin !== a[at].bin) {
          t = a[at + 2]; a[at + 2] = a[j]; a[j] = t;
          swapped = true;
          break;
        }
      }
      if (!swapped) a = shuffle(arr);
    }
    return a;
  }

  function reflectHTML(data) {
    var choices = Array.isArray(data.choices) ? data.choices : [];
    var choiceHtml = choices.length
      ? `<div class="qs-reflect-choices">${choices.map(function (c, i) {
          return `<button type="button" class="qs-reflect-choice" data-qs-choice="${i}">${c.icon ? `<span aria-hidden="true">${esc(c.icon)}</span>` : ''}${esc(c.text || c.label || '')}</button>`;
        }).join('')}</div>`
      : `<button type="button" class="qs-reflect-tap" data-qs-reveal>Toque para pensar</button>`;
    var prompt = esc(data.prompt || data.body || '');
    if (data.promptAccent) {
      prompt = esc(data.prompt || '') + (data.prompt ? '<br>' : '') +
        '<span>' + esc(data.promptAccent) + '</span>';
    }
    return `
      <article class="qs-screen is-content is-text is-reflect" data-qs-root data-type="reflect">
        <div class="qs-panel qs-panel-text qs-panel-reflect">
          <header class="qs-reflect-head">
            <h2 class="qs-title">${esc(data.title || '')}</h2>
          </header>
          <div class="qs-reflect">
            <p class="qs-reflect-prompt">${prompt}</p>
            <div class="qs-reflect-mark" aria-hidden="true">?</div>
            ${choiceHtml}
            <p class="qs-reflect-answer" data-qs-answer hidden>${esc(data.answer || data.quote || '')}</p>
          </div>
        </div>
      </article>`;
  }

  function compareHTML(data) {
    var sides = Array.isArray(data.compare) ? data.compare : [];
    var hasPhotos = sides.some(function (c) { return !!c.image; });
    var open = !!data.open;
    return `
      <article class="qs-screen is-content is-text is-compare${hasPhotos ? ' has-photos' : ''}${open ? ' is-open' : ''}" data-qs-root data-type="compare">
        <div class="qs-panel qs-panel-text">
          <h2 class="qs-title">${esc(data.title || '')}</h2>
          ${data.body && !open ? `<p class="qs-compare-guide">${esc(data.body)}</p>` : ''}
          <div class="qs-compare">${sides.map(function (c, i) {
            var ok = !!c.ok;
            var img = c.image
              ? `<div class="qs-compare-media"><img class="qs-compare-img" src="${esc(c.image)}" alt="${esc(c.imageAlt || c.label || '')}" loading="eager" decoding="async">${zoomChip(c.image, c.imageAlt || c.label || '')}</div>`
              : '';
            return `<button type="button" class="qs-compare-col ${ok ? 'is-ok' : 'is-bad'}${c.image ? ' has-img' : ''}${open ? ' is-open' : ''}" data-qs-compare="${i}"${open ? ' disabled' : ''}>
              <div class="qs-compare-lbl">${esc(c.label || (ok ? '✓ Correto' : '✕ Evitar'))}</div>
              ${img}
              ${open ? '' : '<p class="qs-compare-hint">Toque para ver</p>'}
              <p class="qs-compare-reveal"${open ? '' : ' hidden'}>${esc(c.text || c.body || '')}</p>
            </button>`;
          }).join('')}</div>
        </div>
      </article>`;
  }

  function orderHTML(data) {
    var items = Array.isArray(data.items) ? data.items : [];
    var cards = shuffle(items).map(function (it) {
      return `<button type="button" class="qs-seq-card" data-qs-seq="${esc(it.key)}">
        <span class="qs-seq-badge" aria-hidden="true"></span>
        <span>${esc(it.text)}</span>
      </button>`;
    }).join('');
    return `
      <article class="qs-screen is-content is-text is-order" data-qs-root data-type="order">
        <div class="qs-panel qs-panel-text">
          <h2 class="qs-title">${esc(data.title || 'Ordene a rotina')}</h2>
          <p class="qs-body">${esc(data.body || 'Toque nos cuidados na ordem que você seguiria.')}</p>
          <p class="qs-seq-progress" data-qs-seq-progress>0 de ${items.length} selecionados</p>
          <div class="qs-seq-wrap">${cards}</div>
          <p class="qs-seq-fb" data-qs-seq-fb hidden></p>
        </div>
      </article>`;
  }

  function matchHTML(data) {
    var pairs = Array.isArray(data.pairs) ? data.pairs : [];
    var leftTitle = data.leftTitle || data.exTitle || 'Conceito';
    var rightTitle = data.rightTitle || data.bodyTitle || 'Significado';
    return `
      <article class="qs-screen is-content is-text is-match is-dense" data-qs-root data-type="match">
        <div class="qs-panel qs-panel-text">
          <h2 class="qs-title">${esc(data.title || 'Associe os pares')}</h2>
          <div class="qs-match-hud">
            <span data-qs-match-time>⏱️ 0s</span>
            <span data-qs-match-progress>0 de ${pairs.length} pares</span>
          </div>
          <div class="qs-match">
            <div class="qs-match-side is-ex">
              <div class="qs-match-col-title">${esc(leftTitle)}</div>
              <div data-qs-match-ex></div>
            </div>
            <div class="qs-match-side is-body">
              <div class="qs-match-col-title">${esc(rightTitle)}</div>
              <div data-qs-match-body></div>
            </div>
          </div>
        </div>
      </article>`;
  }

  function sortHTML(data) {
    var items = Array.isArray(data.items) ? data.items : [];
    var left = data.left || { id: 'nok', label: 'Não conforme', icon: '✕' };
    var right = data.right || { id: 'ok', label: 'Conforme', icon: '✓' };
    return `
      <article class="qs-screen is-content is-sort is-timed" data-qs-root data-type="sort">
        <div class="qs-qbar-wrap"><div class="qs-qbar"><i data-qs-timer></i></div></div>
        <header class="qs-sort-head">
          <h2 class="qs-title">${esc(data.title || 'Inspeção')}</h2>
          ${data.body ? `<p class="qs-body">${esc(data.body)}</p>` : ''}
          <p class="qs-sort-progress" data-qs-sort-progress>Caso 1 de ${items.length}</p>
        </header>
        <div class="qs-sort-stage">
          <p class="qs-sort-card" data-qs-sort-card></p>
        </div>
        <div class="qs-sort-bins">
          <button type="button" class="qs-sort-bin is-nok" data-qs-sort-bin="${esc(left.id)}">
            <span aria-hidden="true">${esc(left.icon || '✕')}</span>
            <b>${esc(left.label)}</b>
          </button>
          <button type="button" class="qs-sort-bin is-ok" data-qs-sort-bin="${esc(right.id)}">
            <span aria-hidden="true">${esc(right.icon || '✓')}</span>
            <b>${esc(right.label)}</b>
          </button>
        </div>
        <p class="qs-sort-fb" data-qs-sort-fb hidden></p>
      </article>`;
  }

  function quizIntroHTML(data) {
    var count = data.count != null ? Number(data.count) : null;
    var min = data.minCorrect != null ? Number(data.minCorrect) : null;
    var desc = data.body || '';
    if (!desc && count) {
      desc = 'Responda <strong>' + count + '</strong> perguntas de múltipla escolha.';
      if (min) desc += ' Você precisa acertar no mínimo <strong>' + min + '</strong> para avançar.';
      desc += ' Cada acerto vale <strong>50 pontos</strong>.';
    }
    return `
      <article class="qs-screen is-quiz-intro" data-qs-root data-type="quiz-intro">
        <div class="qs-quiz-intro">
          <div class="qs-quiz-intro-icon" aria-hidden="true">${esc(data.icon || '🎮')}</div>
          <h2 class="qs-quiz-intro-title">${esc(data.title || 'Desafio do módulo')}</h2>
          <p class="qs-quiz-intro-desc">${desc}</p>
          <button type="button" class="qs-quiz-intro-btn" data-qs-start>Iniciar desafio</button>
        </div>
      </article>`;
  }

  function quizResultHTML(data) {
    var passed = !!data.passed;
    var hits = data.score != null ? data.score : 0;
    var total = data.total != null ? data.total : 0;
    var min = data.minCorrect != null ? data.minCorrect : 0;
    var points = data.points != null ? data.points : 0;
    var streak = data.streak != null ? data.streak : 0;
    var medal = data.medal || data.icon || (passed ? '🥇' : '📚');
    var medalName = data.medalName || '';
    var rank = data.medalRank || (passed ? 'gold' : 'none');
    var title = data.title || (passed ? 'Desafio concluído!' : 'Desafio não concluído');
    var unlock = data.titleUnlock || null;
    var hasTitle = !!(passed && unlock && unlock.title);
    var desc = data.body || (data.mode === 'order'
      ? (passed
        ? 'Você montou o fluxo na ordem certa.'
        : 'Toque os 4 passos na ordem: aviso, gestor, SESMT e Moki.')
      : data.mode === 'sort'
      ? (passed
        ? ('Você acertou <strong>' + hits + '</strong> de <strong>' + total + '</strong> situações.')
        : ('Você acertou <strong>' + hits + '</strong> de <strong>' + total + '</strong>. É necessário acertar pelo menos <strong>' + min + '</strong>. Revise o módulo e tente de novo.'))
      : (passed
        ? ('Você acertou <strong>' + hits + '</strong> de <strong>' + total + '</strong> questões.')
        : ('Você acertou <strong>' + hits + '</strong> de <strong>' + total + '</strong>. É necessário acertar pelo menos <strong>' + min + '</strong>. Estude e tente novamente.')));
    var actions = passed
      ? `<button type="button" class="qs-quiz-intro-btn" data-qs-finish>Continuar</button>`
      : `<button type="button" class="qs-quiz-intro-btn" data-qs-retry>Jogar novamente</button>`;

    // reprovado: mostra os temas das questões erradas (sem entregar as respostas)
    var topics = (!passed && Array.isArray(data.review)) ? data.review.filter(Boolean) : [];
    var reviewBlock = topics.length
      ? `<section class="qs-review">
          <p class="qs-review-head">O que revisar antes de tentar de novo</p>
          <ul class="qs-review-list">
            ${topics.map(function (t) {
              return `<li class="qs-review-item"><span class="qs-review-dot" aria-hidden="true"></span><span>${esc(t)}</span></li>`;
            }).join('')}
          </ul>
        </section>`
      : '';
    var scoreBar = data.mode === 'order'
      ? `<div class="qs-result-scorebar" aria-label="Placar">
        <span><b>${points}</b> pts</span>
        <span class="qs-result-scorebar-dot" aria-hidden="true"></span>
        <span>${passed ? 'Fluxo na ordem certa' : 'Ordem ainda incompleta'}</span>
      </div>`
      : `<div class="qs-result-scorebar" aria-label="Placar">
        <span><b>${points}</b> pts</span>
        <span class="qs-result-scorebar-dot" aria-hidden="true"></span>
        <span><b>${hits}/${total}</b> acertos</span>
        ${streak ? `<span class="qs-result-scorebar-dot" aria-hidden="true"></span><span>seq. <b>${streak}</b></span>` : ''}
      </div>`;

    if (hasTitle) {
      return `
      <article class="qs-screen is-quiz-result" data-qs-root data-type="quiz-result">
        <div class="qs-quiz-result is-pass is-title-focus medal-${esc(rank)}">
          <p class="qs-result-eyebrow">${esc(unlock.moduleLabel || 'Módulo concluído')}</p>
          <div class="qs-medal" aria-hidden="true">
            <span class="qs-medal-face">${esc(medal)}</span>
          </div>
          <p class="qs-title-earned-kicker">Título conquistado</p>
          <h2 class="qs-title-earned-name">${esc(unlock.title)}</h2>
          ${unlock.body ? `<p class="qs-title-earned-body">${esc(unlock.body)}</p>` : ''}
          ${scoreBar}
          <div class="qs-quiz-result-actions">${actions}</div>
        </div>
      </article>`;
    }

    return `
      <article class="qs-screen is-quiz-result" data-qs-root data-type="quiz-result">
        <div class="qs-quiz-result ${passed ? 'is-pass' : 'is-fail'}${topics.length ? ' has-review' : ''} medal-${esc(rank)}">
          <div class="qs-medal" aria-hidden="true">
            <span class="qs-medal-face">${esc(medal)}</span>
          </div>
          ${medalName ? `<div class="qs-medal-name">${esc(medalName)}</div>` : ''}
          <h2 class="qs-quiz-result-title">${esc(title)}</h2>
          ${scoreBar}
          <p class="qs-quiz-result-desc">${desc}</p>
          ${reviewBlock}
          <div class="qs-quiz-result-actions">${actions}</div>
        </div>
      </article>`;
  }

  function questionHTML(data) {
    var alts = Array.isArray(data.alternatives) ? data.alternatives.slice(0, 4) : [];
    var count = Math.max(1, alts.length);
    var opts = alts.map(function (a, i) {
      return `
        <button type="button" class="qs-opt" data-tone="${i % 4}" data-id="${esc(a.id != null ? a.id : i)}" data-index="${i}">
          <span class="qs-num">${i + 1}</span>
          <span class="qs-txt">${esc(a.text)}</span>
          <span class="qs-mark" aria-hidden="true"></span>
        </button>`;
    }).join('');

    return `
      <article class="qs-screen is-question" data-qs-root data-type="question">
        <div class="qs-timer" aria-hidden="true"><i data-qs-timer></i></div>
        <div class="qs-media qs-media-hero">
          ${mediaHTML(data)}
          <div class="qs-result-banner" data-qs-result role="status" aria-live="polite" hidden>
            <span data-qs-result-text></span>
          </div>
        </div>
        <div class="qs-qbar-wrap">
          <div class="qs-qbar">${esc(data.question || '')}</div>
        </div>
        <div class="qs-opts count-${count}" data-qs-opts>
          ${opts}
        </div>
        <div class="qs-foot qs-foot-quiz">
          <div class="qs-explain" data-qs-explain></div>
        </div>
      </article>`;
  }

  var zoomUi = null;
  var zoomKey = null;
  var onZoomToggle = null;

  function zoomClose() {
    if (!zoomUi || zoomUi.hidden) return;
    zoomUi.hidden = true;
    zoomUi.classList.remove('is-in');
    var img = zoomUi.querySelector('.qs-zoom-pic');
    if (img) {
      img.removeAttribute('src');
      img.style.transform = '';
    }
    document.body.classList.remove('qs-zoom-on');
    if (zoomKey) {
      document.removeEventListener('keydown', zoomKey);
      zoomKey = null;
    }
    if (typeof onZoomToggle === 'function') onZoomToggle(false);
  }

  function zoomOpen(src, alt) {
    if (!src) return;
    if (!zoomUi) {
      zoomUi = document.createElement('div');
      zoomUi.className = 'qs-zoom';
      zoomUi.hidden = true;
      zoomUi.innerHTML =
        '<button type="button" class="qs-zoom-x" aria-label="Fechar">×</button>' +
        '<button type="button" class="qs-zoom-plus" aria-label="Ampliar">+</button>' +
        '<div class="qs-zoom-stage">' +
          '<img class="qs-zoom-pic" alt="">' +
        '</div>' +
        '<p class="qs-zoom-hint">Toque em + para ampliar · toque fora para fechar</p>';
      document.body.appendChild(zoomUi);
      zoomUi.addEventListener('click', function (e) {
        if (e.target.closest('.qs-zoom-x')) {
          zoomClose();
          return;
        }
        if (e.target.closest('.qs-zoom-plus')) {
          zoomUi.classList.toggle('is-in');
          var on = zoomUi.classList.contains('is-in');
          var plus = zoomUi.querySelector('.qs-zoom-plus');
          plus.textContent = on ? '−' : '+';
          plus.setAttribute('aria-label', on ? 'Reduzir' : 'Ampliar');
          var hint = zoomUi.querySelector('.qs-zoom-hint');
          if (hint) hint.textContent = on
            ? 'Arraste para ver o detalhe · toque em − para reduzir'
            : 'Toque em + para ampliar · toque fora para fechar';
          return;
        }
        if (!e.target.closest('.qs-zoom-pic')) zoomClose();
      });
    }
    var pic = zoomUi.querySelector('.qs-zoom-pic');
    var plus = zoomUi.querySelector('.qs-zoom-plus');
    var hint = zoomUi.querySelector('.qs-zoom-hint');
    pic.src = src;
    pic.alt = alt || '';
    zoomUi.classList.remove('is-in');
    plus.textContent = '+';
    plus.setAttribute('aria-label', 'Ampliar');
    if (hint) hint.textContent = 'Toque em + para ampliar · toque fora para fechar';
    zoomUi.hidden = false;
    document.body.classList.add('qs-zoom-on');
    zoomKey = function (e) { if (e.key === 'Escape') zoomClose(); };
    document.addEventListener('keydown', zoomKey);
    if (typeof onZoomToggle === 'function') onZoomToggle(true);
  }

  function QuestionScreen(container, data, options) {
    this.el = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = options || {};
    this.state = { answered: false, selectedIndex: null, correct: false };
    this.data = null;
    this._onClick = this._onClick.bind(this);
    this.update(data || {});
  }

  QuestionScreen.mount = function (container, data, options) {
    return new QuestionScreen(container, data, options);
  };

  QuestionScreen.prototype.update = function (data) {
    this._stopTimer();
    onZoomToggle = null;
    this._stopStackAuto();
    zoomClose();
    this.data = data || {};
    this.state.answered = false;
    this.state.selectedIndex = null;
    this.state.correct = false;

    var type = this.data.type || 'question';
    var html = questionHTML(this.data);
    if (type === 'cover') html = coverHTML(this.data);
    else if (type === 'finale') html = finaleHTML(this.data);
    else if (type === 'content') html = contentHTML(this.data);
    else if (type === 'video') html = videoHTML(this.data);
    else if (type === 'image') html = imageHTML(this.data);
    else if (type === 'reflect') html = reflectHTML(this.data);
    else if (type === 'compare') html = compareHTML(this.data);
    else if (type === 'order') html = orderHTML(this.data);
    else if (type === 'match') html = matchHTML(this.data);
    else if (type === 'sort') html = sortHTML(this.data);
    else if (type === 'quiz-intro') html = quizIntroHTML(this.data);
    else if (type === 'quiz-result') html = quizResultHTML(this.data);

    this.el.innerHTML = html;
    this.root = this.el.querySelector('[data-qs-root]');
    this.el.removeEventListener('click', this._onClick);
    this.el.addEventListener('click', this._onClick);

    var lockedVideo = type === 'video' && !!(this.data.embed || this.data.panda || this.data.video);
    var gated = type === 'question' || type === 'order' || type === 'match' || type === 'sort' || type === 'reflect' || type === 'compare' || lockedVideo || (type === 'content' && !!(this.data && this.data.steps));
    if (!gated) this.state.answered = true;

    if (type === 'video' && (this.data.embed || this.data.panda || this.data.youtube || this.data.video)) {
      this._bindVideoTags();
    }
    if (type === 'reflect') this._bindReflect();
    if (type === 'compare') this._bindCompare();
    if (type === 'order') this._bindOrder();
    if (type === 'match') this._bindMatch();
    if (type === 'sort') this._bindSort();
    if (type === 'content' && this.data && this.data.steps) this._bindSteps();
    if (type === 'content' && this.data && this.data.links) this._bindHazard();
    if (type === 'content' && this.data && this.data.layout === 'qualify') this._bindQualify();
    if (type === 'content' && this.data && this.data.spots) this._bindExplore();
    if (type === 'content' && this.data && this.data.stack) this._bindStack();
    if (type === 'content' && this.data && this.data.sensitive) this._bindSensitive();
    this._bindZoom();

    if ((type === 'question' || type === 'sort') && this.options.quizScoring) {
      if (this.root) this.root.classList.add('is-timed');
      this._startTimer();
    }

    if (typeof this.options.onRender === 'function') {
      this.options.onRender(this.data, this);
    }
  };

  QuestionScreen.prototype._stopTimer = function () {
    if (this._tick) {
      clearInterval(this._tick);
      this._tick = null;
    }
  };

  QuestionScreen.prototype._startTimer = function () {
    this._stopTimer();
    var self = this;
    var total = Number(this.options.time || this.data.time || 40);
    this._tTot = total;
    this._tLeft = total;
    var bar = this.el.querySelector('[data-qs-timer]');
    if (bar) bar.style.width = '100%';
    this._tick = setInterval(function () {
      if (self.state.answered) {
        self._stopTimer();
        return;
      }
      self._tLeft -= 0.1;
      if (bar) bar.style.width = (Math.max(0, self._tLeft / self._tTot) * 100) + '%';
      if (self._tLeft <= 0) {
        self._stopTimer();
        self.timesUp();
      }
    }, 100);
  };

  QuestionScreen.prototype._quizPoints = function (correct) {
    if (!correct) return 0;
    /* Pontuação fixa por acerto: sem bônus de rapidez. */
    var max = this.options.maxPoints != null ? Number(this.options.maxPoints) : 50;
    return max;
  };

  QuestionScreen.prototype._setVideoPlaying = function (on) {
    var root = this.el.querySelector('[data-qs-root]') || this.root;
    if (root) root.classList.toggle('is-playing', !!on);
  };

  QuestionScreen.prototype._unlockVideo = function () {
    if (this._videoUnlocked) return;
    this._videoUnlocked = true;
    this._complete({ kind: 'video' });
  };

  QuestionScreen.prototype._bindSensitive = function () {
    var box = this.el.querySelector('[data-qs-sensitive]');
    var btn = this.el.querySelector('[data-qs-reveal-img]');
    if (!box || !btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      box.classList.add('is-open');
    });
  };

  QuestionScreen.prototype._bindZoom = function () {
    var root = this.el;
    if (!root) return;
    root.querySelectorAll('[data-qs-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var src = btn.getAttribute('data-qs-zoom');
        if (!src) return;
        beep('click');
        zoomOpen(src, btn.getAttribute('data-qs-zoom-alt') || '');
      });
      if (btn.tagName === 'BUTTON') return;
      btn.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        e.stopPropagation();
        btn.click();
      });
    });
  };

  QuestionScreen.prototype._bindVideoTags = function () {
    var self = this;
    var root = this.el;
    var native = root.querySelector('video.qs-player');
    var iframe = root.querySelector('iframe[data-qs-panda]');

    function expand() { self._setVideoPlaying(true); }
    function collapse() { self._setVideoPlaying(false); }

    var guard = {
      maxWatched: 0,
      duration: parseClock(this.data.duration),
      seekingBack: false,
      isSeeking: false,
      lastWall: 0,
      seekTimer: null,
      backTimer: null
    };
    this._videoGuard = guard;
    this._videoUnlocked = false;

    function snapBack() {
      if (self._videoUnlocked) return;
      guard.seekingBack = true;
      var target = Math.max(0, guard.maxWatched);
      try {
        if (self._pandaPlayer && self._pandaPlayer.setCurrentTime) self._pandaPlayer.setCurrentTime(target);
      } catch (e) {}
      try {
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'currentTime', parameter: target }, '*');
        }
      } catch (e) {}
      if (native) { try { native.currentTime = target; } catch (e) {} }
      clearTimeout(guard.backTimer);
      guard.backTimer = setTimeout(function () {
        guard.seekingBack = false;
        guard.lastWall = Date.now();
      }, 350);
    }

    function handleSeek(t) {
      if (self._videoUnlocked) return;
      guard.isSeeking = true;
      if (typeof t === 'number' && !isNaN(t) && t > guard.maxWatched + VIDEO_SEEK_TOLERANCE) snapBack();
      clearTimeout(guard.seekTimer);
      guard.seekTimer = setTimeout(function () {
        guard.isSeeking = false;
        guard.lastWall = Date.now();
      }, 280);
    }

    function handleTime(t, dur) {
      if (typeof dur === 'number' && dur > 0) guard.duration = dur;
      if (typeof t !== 'number' || isNaN(t)) return;
      if (self._videoUnlocked || guard.seekingBack) return;
      if (guard.isSeeking) {
        if (t > guard.maxWatched + VIDEO_SEEK_TOLERANCE) snapBack();
        return;
      }
      var now = Date.now();
      var wallDt = guard.lastWall ? Math.max(0, (now - guard.lastWall) / 1000) : 0.25;
      guard.lastWall = now;
      // só cresce no ritmo real de reprodução: seek disfarçado estoura a folga
      var allowed = guard.maxWatched + Math.min(VIDEO_TICK_TOLERANCE, wallDt * 1.4 + 0.12);
      if (t > allowed) { snapBack(); return; }
      if (t > guard.maxWatched) guard.maxWatched = t;
      if (guard.maxWatched >= unlockThreshold(guard.duration)) self._unlockVideo();
    }

    this._videoOnTime = handleTime;
    this._videoOnSeek = handleSeek;

    if (native) {
      native.addEventListener('play', expand);
      native.addEventListener('pause', collapse);
      native.addEventListener('ended', function () { collapse(); self._unlockVideo(); });
      native.addEventListener('loadedmetadata', function () { handleTime(0, native.duration); });
      native.addEventListener('seeking', function () { handleSeek(native.currentTime); });
      native.addEventListener('seeked', function () { handleSeek(native.currentTime); });
      native.addEventListener('timeupdate', function () { handleTime(native.currentTime, native.duration); });
    }

    var videoId = (String(this.data.embed || this.data.panda || '').match(/[?&]v=([0-9a-f-]{36})/i) || [])[1] || '';

    this._onVideoMsg = function (ev) {
      var data = ev && ev.data;
      if (data == null) return;
      var msg = '';
      var payload = null;
      if (typeof data === 'object') {
        payload = data;
        msg = data.message || data.event || data.type || '';
      } else if (typeof data === 'string') {
        msg = data;
        try {
          var parsed = JSON.parse(data);
          payload = parsed;
          msg = parsed.message || parsed.event || parsed.type || data;
        } catch (e) {}
      }
      msg = String(msg).toLowerCase();
      if (payload && payload.video && videoId && String(payload.video) !== videoId) return;

      var t = payload && typeof payload.currentTime === 'number' ? payload.currentTime : null;
      var dur = payload && typeof payload.duration === 'number' ? payload.duration : null;

      if (msg.indexOf('panda_play') !== -1) { expand(); guard.lastWall = Date.now(); }
      if (msg.indexOf('panda_pause') !== -1) collapse();
      if (msg.indexOf('panda_ended') !== -1 || msg.indexOf('panda_complete') !== -1) {
        collapse();
        self._unlockVideo();
        return;
      }
      if (msg.indexOf('panda_seeking') !== -1 || msg.indexOf('panda_seeked') !== -1) {
        handleSeek(t);
        return;
      }
      if (msg.indexOf('panda_timeupdate') !== -1) handleTime(t, dur);
    };
    window.addEventListener('message', this._onVideoMsg);

    if (iframe && iframe.id) {
      this._ensurePandaApi(iframe.id, function (player) {
        self._pandaPlayer = player;
        try {
          var d = player.getDuration && player.getDuration();
          if (typeof d === 'number' && d > 0) guard.duration = d;
        } catch (e) {}
        guard.lastWall = Date.now();
        try {
          player.onEvent(function (e) {
            var msg = e && e.message;
            var t = e && typeof e.currentTime === 'number' ? e.currentTime : null;
            if (msg === 'panda_play') { expand(); guard.lastWall = Date.now(); }
            if (msg === 'panda_pause') collapse();
            if (msg === 'panda_ended') { collapse(); self._unlockVideo(); return; }
            if (msg === 'panda_seeking' || msg === 'panda_seeked') { handleSeek(t); return; }
            if (msg === 'panda_timeupdate') {
              var dd = 0;
              try { dd = player.getDuration && player.getDuration(); } catch (err) {}
              handleTime(t, dd);
            }
          });
        } catch (err) {}
      });
    }
  };

  QuestionScreen.prototype._ensurePandaApi = function (iframeId, onReady) {
    var API = 'https://player.pandavideo.com.br/api.v2.js';
    function bind() {
      try {
        if (typeof PandaPlayer === 'undefined') return;
        var player = new PandaPlayer(iframeId, {
          onReady: function () { onReady(player); }
        });
      } catch (err) {}
    }
    window.pandascripttag = window.pandascripttag || [];
    window.pandascripttag.push(bind);
    if (!document.querySelector('script[src="' + API + '"]')) {
      var s = document.createElement('script');
      s.src = API;
      s.async = true;
      document.head.appendChild(s);
    } else if (typeof PandaPlayer !== 'undefined') {
      bind();
    }
  };

  QuestionScreen.prototype._onClick = function (e) {
    var opt = e.target.closest('.qs-opt');
    var start = e.target.closest('[data-qs-start]');
    var retry = e.target.closest('[data-qs-retry]');
    var finish = e.target.closest('[data-qs-finish]');
    var back = e.target.closest('[data-qs-back]');
    if (opt && !this.state.answered) {
      beep('click');
      this.select(+opt.dataset.index);
      return;
    }
    if (start || retry || finish || back) {
      beep('click');
      if (typeof this.options.onContinue === 'function') {
        this.options.onContinue({
          data: this.data,
          action: start ? 'start' : (retry ? 'retry' : (finish ? 'finish' : 'back'))
        });
      }
    }
  };

  QuestionScreen.prototype.timesUp = function () {
    if (this.state.answered) return;
    if (this.data.type === 'order') {
      this._finishOrder(true);
      return;
    }
    if (this.data.type === 'sort') {
      this._finishSort(true);
      return;
    }
    this.select(-1, { timedOut: true });
  };

  QuestionScreen.prototype._complete = function (info) {
    if (this.state.answered && this.data.type !== 'match') return;
    this.state.answered = true;
    this._stopTimer();
    if (typeof this.options.onSelect === 'function') {
      this.options.onSelect(Object.assign({
        correct: true,
        points: 0,
        timedOut: false,
        data: this.data
      }, info || {}));
    }
  };

  QuestionScreen.prototype._bindReflect = function () {
    var self = this;
    var root = this.el;
    var card = root.querySelector('.qs-reflect');
    var answer = root.querySelector('[data-qs-answer]');
    function reveal(btn) {
      beep('click');
      if (btn) btn.classList.add('is-chosen');
      if (card) card.classList.add('is-revealed');
      if (answer) {
        answer.hidden = false;
        answer.classList.add('show');
      }
      var tap = root.querySelector('[data-qs-reveal]');
      if (tap) tap.hidden = true;
      if (!self.state.answered) {
        beep('ok');
        self._complete({ kind: 'reflect' });
      }
    }
    root.querySelectorAll('[data-qs-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        root.querySelectorAll('[data-qs-choice]').forEach(function (b) { b.classList.remove('is-chosen'); });
        reveal(btn);
      });
    });
    var tap = root.querySelector('[data-qs-reveal]');
    if (tap) tap.addEventListener('click', function () { reveal(tap); });
  };

  QuestionScreen.prototype._bindHazard = function () {
    var rows = this.el.querySelectorAll('[data-qs-hazard]');
    var cap = this.el.querySelector('[data-qs-hazard-cap]');
    var links = (this.data && this.data.links) || [];
    rows.forEach(function (row) {
      row.addEventListener('click', function () {
        rows.forEach(function (r) { r.classList.remove('is-on'); });
        row.classList.add('is-on');
        var i = Number(row.getAttribute('data-qs-hazard'));
        if (cap && links[i] && links[i].note) cap.textContent = links[i].note;
        beep('click');
      });
    });
  };

  QuestionScreen.prototype._bindQualify = function () {
    var picks = (this.data && this.data.picks) || [];
    var steps = this.el.querySelectorAll('[data-qs-qualify]');
    var panel = this.el.querySelector('[data-qs-qualify-panel]');
    var elTag = this.el.querySelector('[data-qs-qualify-tag]');
    var elTitle = this.el.querySelector('[data-qs-qualify-title]');
    var elBody = this.el.querySelector('[data-qs-qualify-body]');
    var elPoints = this.el.querySelector('[data-qs-qualify-points]');
    var bar = this.el.querySelector('[data-qs-qualify-bar]');
    var done = this.el.querySelector('[data-qs-qualify-done]');
    var seen = { 0: true };

    function paintMeter() {
      var n = Object.keys(seen).length;
      if (bar) bar.style.width = Math.round((n / Math.max(picks.length, 1)) * 100) + '%';
      if (done && n === picks.length) done.hidden = false;
    }
    paintMeter();

    steps.forEach(function (step) {
      step.addEventListener('click', function () {
        var i = Number(step.getAttribute('data-qs-qualify'));
        var pick = picks[i] || {};
        steps.forEach(function (s) { s.classList.remove('is-on'); });
        step.classList.add('is-on', 'is-seen');
        seen[i] = true;
        if (elTag) elTag.textContent = 'Requisito ' + (pick.n || String(i + 1).padStart(2, '0'));
        if (elTitle) elTitle.textContent = pick.title || '';
        if (elBody) elBody.textContent = pick.body || '';
        if (elPoints) {
          elPoints.innerHTML = (pick.points || []).map(function (pt) {
            return '<li>' + esc(pt) + '</li>';
          }).join('');
        }
        if (panel) {
          panel.classList.remove('is-in');
          void panel.offsetWidth;
          panel.classList.add('is-in');
        }
        paintMeter();
        beep('click');
      });
    });
  };

  QuestionScreen.prototype._bindExplore = function () {
    var spots = (this.data && this.data.spots) || [];
    var tabs = this.el.querySelectorAll('[data-qs-explore]');
    var dots = this.el.querySelectorAll('[data-qs-explore-dot]');
    var elTitle = this.el.querySelector('[data-qs-explore-title]');
    var elBody = this.el.querySelector('[data-qs-explore-body]');
    var elCount = this.el.querySelector('[data-qs-explore-count]');
    var panel = this.el.querySelector('[data-qs-explore-panel]');
    var seen = { 0: true };
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var i = Number(tab.getAttribute('data-qs-explore'));
        var spot = spots[i] || {};
        tabs.forEach(function (t) { t.classList.remove('is-on'); });
        tab.classList.add('is-on');
        if (elTitle) elTitle.textContent = spot.title || '';
        if (elBody) elBody.textContent = spot.body || '';
        seen[i] = true;
        if (dots[i]) dots[i].classList.add('is-seen');
        if (elCount) elCount.textContent = Object.keys(seen).length + ' de ' + spots.length;

        /* reinicia a animação de entrada: sem o reflow o navegador reaproveita
           a classe que já está lá e a troca acontece sem transição. */
        if (panel) {
          panel.classList.remove('is-in');
          void panel.offsetWidth;
          panel.classList.add('is-in');
        }
        beep('click');
      });
    });
  };

  QuestionScreen.prototype._bindStack = function () {
    var self = this;
    var cards = Array.prototype.slice.call(this.el.querySelectorAll('[data-qs-stack]'));
    var count = this.el.querySelector('[data-qs-stack-count]');
    var cap = this.el.querySelector('[data-qs-stack-cap]');
    var hint = this.el.querySelector('[data-qs-stack-hint]');
    var tap = this.el.querySelector('[data-qs-stack-tap]');
    var slides = (this.data && this.data.stack) || [];
    var total = cards.length;
    if (total < 1) return;
    var order = cards.map(function (_, i) { return i; });

    var OUT_MS = 320;
    var moving = false;

    function paint(skip) {
      order.forEach(function (idx, pos) {
        var card = cards[idx];
        if (card === skip) return;
        card.setAttribute('data-pos', String(pos));
        card.style.zIndex = String(total - pos);
      });
      var front = order[0];
      if (count) count.textContent = (front + 1) + ' de ' + total;
      if (cap) cap.textContent = (slides[front] && slides[front].caption) || '';
    }

    /* A foto da frente sai de cena antes de virar a última do baralho. Se ela
       apenas trocasse de camada, o salto para trás aconteceria no meio do
       movimento — era o que travava a animação. */
    function advance() {
      if (moving || total < 2) return;
      moving = true;

      var leaving = cards[order[0]];
      order.push(order.shift());

      leaving.style.zIndex = String(total + 1);
      leaving.classList.add('is-out');
      paint(leaving);

      setTimeout(function () {
        // volta ao fundo sem transição: sem isso ela atravessaria a tela de volta
        leaving.classList.add('is-silent');
        leaving.classList.remove('is-out');
        paint();
        requestAnimationFrame(function () {
          void leaving.offsetWidth;
          leaving.classList.remove('is-silent');
          moving = false;
        });
      }, OUT_MS);
    }

    /* Passa sozinho para o aluno perceber que existe mais de uma foto; o
       relógio reinicia a cada toque para não trocar a imagem debaixo do dedo. */
    function play() {
      self._stopStackAuto();
      if (total < 2) return;
      self._stackAuto = setInterval(advance, Number(self.data.interval) || 4200);
    }

    paint();
    play();
    onZoomToggle = function (open) {
      if (open) self._stopStackAuto();
      else play();
    };

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        // só a foto da frente avança: clicar na borda de trás não embaralha
        if (total < 2 || card.getAttribute('data-pos') !== '0') return;
        advance();
        play();
        beep('click');
        if (tap) tap.classList.add('is-done');
        if (hint) hint.textContent = 'Toque para ver a próxima';
      });
    });
  };

  QuestionScreen.prototype._stopStackAuto = function () {
    if (this._stackAuto) {
      clearInterval(this._stackAuto);
      this._stackAuto = null;
    }
  };

  QuestionScreen.prototype._bindCompare = function () {
    var self = this;
    if (this.data && this.data.open) {
      self._complete({ kind: 'compare' });
      return;
    }
    var opened = {};
    var cols = this.el.querySelectorAll('[data-qs-compare]');
    cols.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('is-open')) return;
        btn.classList.add('is-open');
        beep('click');
        var hint = btn.querySelector('.qs-compare-hint');
        var reveal = btn.querySelector('.qs-compare-reveal');
        if (hint) hint.hidden = true;
        if (reveal) reveal.hidden = false;
        opened[btn.getAttribute('data-qs-compare')] = true;
        if (Object.keys(opened).length >= cols.length) {
          beep('ok');
          self._complete({ kind: 'compare' });
        }
      });
    });
  };

  QuestionScreen.prototype._bindSteps = function () {
    var self = this;
    var root = this.el.querySelector('[data-qs-steps]');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-qs-step]'));
    var count = root.querySelector('[data-qs-step-count]');
    var prev = root.querySelector('[data-qs-step-prev]');
    var next = root.querySelector('[data-qs-step-next]');
    var i = 0;
    var total = slides.length;
    var farthest = 0; // só avança em ordem; não dá para pular exercício

    function paint() {
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle('is-on', on);
        s.hidden = !on;
      });
      if (count) count.textContent = 'Exercício ' + (i + 1) + ' de ' + total;
      if (prev) prev.hidden = i <= 0;

      if (!next) return;
      if (self.state.answered) {
        next.hidden = true;
        return;
      }
      next.hidden = false;
      if (i < total - 1) {
        next.textContent = 'Próximo exercício';
        next.classList.remove('is-finish');
      } else {
        next.textContent = 'Concluir sequência';
        next.classList.add('is-finish');
      }
    }

    function goTo(n) {
      if (n < 0 || n >= total) return;
      /* Só permite voltar ou avançar um a um até onde já chegou —
         assim a seta da página não libera sem ver tudo. */
      if (n > farthest + 1) return;
      i = n;
      farthest = Math.max(farthest, i);
      paint();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        beep('click');
        goTo(i - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        beep('click');
        if (i < total - 1) {
          goTo(i + 1);
          return;
        }
        if (!self.state.answered) {
          beep('ok');
          root.classList.add('is-done');
          self._complete({ kind: 'steps' });
          paint();
        }
      });
    }
    paint();
  };

  QuestionScreen.prototype._bindOrder = function () {
    var self = this;
    this._seqTapped = [];
    this.el.querySelectorAll('[data-qs-seq]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (self.state.answered || btn.classList.contains('is-picked')) return;
        beep('click');
        var key = btn.getAttribute('data-qs-seq');
        self._seqTapped.push(key);
        btn.classList.add('is-picked');
        var badge = btn.querySelector('.qs-seq-badge');
        if (badge) badge.textContent = String(self._seqTapped.length);
        var prog = self.el.querySelector('[data-qs-seq-progress]');
        var total = (self.data.items || []).length;
        if (prog) prog.textContent = self._seqTapped.length + ' de ' + total + ' selecionados';
        if (self._seqTapped.length >= total) self._finishOrder(false);
      });
    });
  };

  QuestionScreen.prototype._finishOrder = function (timedOut) {
    if (this.state.answered) return;
    this._stopTimer();
    var self = this;
    var items = this.data.items || [];
    var expected = items.slice().sort(function (a, b) { return a.rank - b.rank; }).map(function (it) { return it.key; });
    var tapped = this._seqTapped || [];
    var correct = !timedOut && tapped.length === expected.length;
    if (correct) {
      for (var i = 0; i < expected.length; i++) {
        if (tapped[i] !== expected[i]) { correct = false; break; }
      }
    }
    this.el.querySelectorAll('[data-qs-seq]').forEach(function (c) {
      c.classList.add('is-picked');
      c.style.pointerEvents = 'none';
    });
    var fb = this.el.querySelector('[data-qs-seq-fb]');
    if (fb) {
      fb.hidden = false;
      fb.className = 'qs-seq-fb ' + (correct ? 'is-ok' : 'is-nok');
      fb.textContent = timedOut
        ? 'Tempo esgotado. Tente de novo.'
        : (correct ? 'Isso! Essa é a ordem do fluxo.' : 'Ainda não é essa a ordem. Tente de novo.');
    }
    beep(correct ? 'ok' : 'nok');
    if (!correct && !timedOut) {
      setTimeout(function () {
        if (self.state.answered) return;
        self._seqTapped = [];
        self.el.querySelectorAll('[data-qs-seq]').forEach(function (c) {
          c.classList.remove('is-picked');
          c.style.pointerEvents = '';
          var badge = c.querySelector('.qs-seq-badge');
          if (badge) badge.textContent = '';
        });
        var prog = self.el.querySelector('[data-qs-seq-progress]');
        if (prog) prog.textContent = '0 de ' + items.length + ' selecionados';
        if (fb) fb.hidden = true;
      }, 1400);
      return;
    }
    var pts = this.options.quizScoring ? this._quizPoints(correct) : 0;
    this._complete({
      kind: 'order',
      correct: correct,
      points: pts,
      timedOut: !!timedOut,
      total: 1,
      hits: correct ? 1 : 0
    });
  };

  QuestionScreen.prototype._bindMatch = function () {
    var self = this;
    var pairs = this.data.pairs || [];
    var ids = pairs.map(function (_, i) { return i; });
    var exOrder = shuffle(ids.slice());
    var bodyOrder = shuffle(ids.slice());
    var matched = {};
    var matchedCount = 0;
    var selectedEx = null;
    var selectedBody = null;
    var elapsed = 0;
    this._matchTick = setInterval(function () {
      elapsed += 1;
      var el = self.el.querySelector('[data-qs-match-time]');
      if (el) el.textContent = '⏱️ ' + elapsed + 's';
    }, 1000);

    function render() {
      var exCol = self.el.querySelector('[data-qs-match-ex]');
      var bodyCol = self.el.querySelector('[data-qs-match-body]');
      if (!exCol || !bodyCol) return;
      exCol.innerHTML = '';
      bodyCol.innerHTML = '';
      exOrder.forEach(function (id) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'qs-match-item' + (matched[id] ? ' is-matched' : '');
        btn.textContent = pairs[id].ex;
        if (matched[id]) btn.disabled = true;
        btn.addEventListener('click', function () { pick('ex', id, btn); });
        exCol.appendChild(btn);
      });
      bodyOrder.forEach(function (id) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'qs-match-item' + (matched[id] ? ' is-matched' : '');
        btn.textContent = pairs[id].body;
        if (matched[id]) btn.disabled = true;
        btn.addEventListener('click', function () { pick('body', id, btn); });
        bodyCol.appendChild(btn);
      });
      var prog = self.el.querySelector('[data-qs-match-progress]');
      if (prog) prog.textContent = matchedCount + ' de ' + pairs.length + ' pares';
    }

    function clearSel() {
      self.el.querySelectorAll('.qs-match-item').forEach(function (el) { el.classList.remove('is-selected'); });
      selectedEx = null;
      selectedBody = null;
    }

    function pick(side, id, btn) {
      if (matched[id] || self.state.answered) return;
      beep('click');
      var sel = side === 'ex' ? '[data-qs-match-ex] .qs-match-item' : '[data-qs-match-body] .qs-match-item';
      self.el.querySelectorAll(sel).forEach(function (el) { el.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      if (side === 'ex') selectedEx = id;
      else selectedBody = id;
      if (selectedEx == null || selectedBody == null) return;
      if (selectedEx === selectedBody) {
        matched[selectedEx] = true;
        matchedCount += 1;
        clearSel();
        render();
        if (matchedCount >= pairs.length) {
          if (self._matchTick) { clearInterval(self._matchTick); self._matchTick = null; }
          var max = self.options.maxPoints != null ? Number(self.options.maxPoints) : 50;
          var pts = max;
          beep('end');
          self._complete({
            kind: 'match',
            correct: true,
            points: pts,
            elapsed: elapsed,
            total: pairs.length,
            hits: pairs.length
          });
        }
      } else {
        beep('nok');
        var a = self.el.querySelector('[data-qs-match-ex] .is-selected');
        var b = self.el.querySelector('[data-qs-match-body] .is-selected');
        [a, b].forEach(function (el) {
          if (!el) return;
          el.classList.add('is-wrong');
          setTimeout(function () { el.classList.remove('is-wrong'); }, 400);
        });
        setTimeout(clearSel, 420);
      }
    }

    render();
  };

  QuestionScreen.prototype._bindSort = function () {
    var self = this;
    var deck = shuffleMixedBins((this.data.items || []).slice());
    var index = 0;
    var moving = false;
    var hits = 0;
    var card = this.el.querySelector('[data-qs-sort-card]');
    var prog = this.el.querySelector('[data-qs-sort-progress]');
    var fb = this.el.querySelector('[data-qs-sort-fb]');

    function showCase(enter) {
      var item = deck[index];
      if (!card || !item) return;
      card.textContent = item.text;
      card.classList.remove('is-wrong', 'is-ok', 'is-out');
      if (enter) {
        card.classList.remove('is-in');
        void card.offsetWidth;
        card.classList.add('is-in');
      }
      if (prog) prog.textContent = 'Caso ' + (index + 1) + ' de ' + deck.length;
      if (fb) {
        fb.hidden = true;
        fb.textContent = '';
        fb.className = 'qs-sort-fb';
      }
    }

    function finish(timedOut) {
      if (self.state.answered) return;
      var min = self.data.minCorrect != null ? Number(self.data.minCorrect) : Math.ceil(deck.length * 0.75);
      var passed = hits >= min;
      var pts = 0;
      if (self.options.quizScoring) {
        var max = self.options.maxPoints != null ? Number(self.options.maxPoints) : 50;
        pts = Math.round(max * hits / Math.max(1, deck.length));
      }
      if (fb) {
        fb.hidden = false;
        fb.className = 'qs-sort-fb ' + (passed ? 'is-ok' : 'is-nok');
        fb.textContent = timedOut && hits < deck.length
          ? ('Tempo esgotado. Você acertou ' + hits + ' de ' + deck.length + '.')
          : (passed
            ? ('Inspeção concluída — ' + hits + ' de ' + deck.length + ' no lugar certo.')
            : ('Você acertou ' + hits + ' de ' + deck.length + '.'));
      }
      self.el.querySelectorAll('[data-qs-sort-bin]').forEach(function (btn) {
        btn.disabled = true;
      });
      beep(passed ? 'end' : 'nok');
      self._complete({
        kind: 'sort',
        correct: passed,
        hits: hits,
        total: deck.length,
        points: pts,
        timedOut: !!timedOut
      });
    }

    function goNext(ok) {
      index += 1;
      moving = true;
      setTimeout(function () {
        moving = false;
        if (index >= deck.length) finish(false);
        else showCase(true);
      }, ok ? 420 : 1100);
    }

    this._finishSort = function (timedOut) { finish(!!timedOut); };

    this.el.querySelectorAll('[data-qs-sort-bin]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (self.state.answered || moving || index >= deck.length) return;
        var item = deck[index];
        var pick = btn.getAttribute('data-qs-sort-bin');
        var ok = pick === item.bin;
        if (ok) {
          hits += 1;
          beep('ok');
          card.classList.remove('is-wrong');
          card.classList.add('is-ok', 'is-out');
          if (fb) {
            fb.hidden = false;
            fb.className = 'qs-sort-fb is-ok';
            fb.textContent = 'Certo.';
          }
        } else {
          beep('nok');
          card.classList.remove('is-wrong', 'is-ok');
          void card.offsetWidth;
          card.classList.add('is-wrong', 'is-out');
          if (fb) {
            fb.hidden = false;
            fb.className = 'qs-sort-fb is-nok';
            fb.textContent = item.hint || 'Não conforme com a NR-11.';
          }
        }
        goNext(ok);
      });
    });

    showCase(true);
  };

  QuestionScreen.prototype._finishSort = function (timedOut) {
    if (this.state.answered) return;
    this._complete({ kind: 'sort', correct: false, points: 0, timedOut: !!timedOut });
  };

  QuestionScreen.prototype.select = function (index, extra) {
    if (this.state.answered) return;
    extra = extra || {};
    var alts = this.data.alternatives || [];
    var timedOut = !!extra.timedOut || index < 0;
    if (!timedOut && (index < 0 || index >= alts.length)) return;

    this._stopTimer();
    this.state.answered = true;
    this.state.selectedIndex = timedOut ? null : index;
    var opinion = !!this.data.opinion;
    var chosen = timedOut ? null : alts[index];
    var correctIndex = alts.findIndex(function (a) { return !!a.correct; });
    var isCorrect = timedOut ? false : (opinion ? true : !!(chosen && chosen.correct));
    this.state.correct = isCorrect;
    var pts = this.options.quizScoring ? this._quizPoints(isCorrect) : 0;
    this.state.points = pts;

    var buttons = this.el.querySelectorAll('.qs-opt');
    buttons.forEach(function (btn, i) {
      btn.disabled = true;
      btn.classList.add('is-revealed');
      if (!timedOut && i === index) btn.classList.add('is-selected');
      if (opinion) {
        if (i === index) {
          btn.classList.add('is-correct');
          btn.querySelector('.qs-mark').textContent = '✓';
        } else {
          btn.classList.add('is-dim');
        }
        return;
      }
      if (isCorrect && i === correctIndex) {
        btn.classList.add('is-correct');
        btn.querySelector('.qs-mark').textContent = '✓';
      } else if (!timedOut && i === index) {
        btn.classList.add('is-wrong');
        btn.querySelector('.qs-mark').textContent = '✕';
      } else {
        btn.classList.add('is-dim');
      }
    });

    var media = this.el.querySelector('.qs-media');
    if (media) {
      media.classList.remove('is-ok', 'is-nok');
      media.classList.add('is-answered', isCorrect ? 'is-ok' : 'is-nok');
    }

    var result = this.el.querySelector('[data-qs-result]');
    if (result) {
      result.hidden = false;
      var resultText = result.querySelector('[data-qs-result-text]');
      var label = 'Não foi dessa vez';
      if (opinion) label = 'Registrado';
      else if (timedOut) label = 'Tempo esgotado';
      else if (isCorrect) label = pts ? ('Acertou · +' + pts) : 'Acertou';
      if (resultText) resultText.textContent = label;
    }

    var explain = this.el.querySelector('[data-qs-explain]');
    if (explain) {
      var explainText = this.data.explanation || '';
      if (explainText) {
        explain.textContent = explainText;
        explain.classList.add('show', isCorrect ? 'is-ok' : 'is-nok');
      }
    }

    beep(isCorrect ? 'ok' : 'nok');

    if (typeof this.options.onSelect === 'function') {
      this.options.onSelect({
        correct: isCorrect,
        selectedIndex: this.state.selectedIndex,
        points: pts,
        timedOut: timedOut,
        data: this.data
      });
    }
  };

  QuestionScreen.prototype.destroy = function () {
    this._stopTimer();
    this._stopStackAuto();
    onZoomToggle = null;
    zoomClose();
    if (this._matchTick) {
      clearInterval(this._matchTick);
      this._matchTick = null;
    }
    var vid = this.el.querySelector('video');
    if (vid) { try { vid.pause(); } catch (e) {} }
    if (this._videoGuard) {
      clearTimeout(this._videoGuard.seekTimer);
      clearTimeout(this._videoGuard.backTimer);
      this._videoGuard = null;
    }
    this._pandaPlayer = null;
    if (this._onVideoMsg) {
      window.removeEventListener('message', this._onVideoMsg);
      this._onVideoMsg = null;
    }
    this.el.removeEventListener('click', this._onClick);
    this.el.innerHTML = '';
  };

  global.QuestionScreen = QuestionScreen;
})(typeof window !== 'undefined' ? window : globalThis);
