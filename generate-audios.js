/**
 * Encaminha para o gerador via proxy TecnoCursos + ElevenLabs.
 *
 *      node generate-audios-proxy.js
 *      node generate-audios-proxy.js home m1-cover
 *      node generate-audios-proxy.js --force
 *
 * Credenciais: AUTH_USERNAME e AUTH_PASSWORD no .env (nunca no código).
 */
'use strict';

require('./generate-audios-proxy.js');
