/**
 * Conteúdo da Trilha NR-11 — Operação de Paleteira Manual
 * Tipos: cover | content | quiz-intro | question | finale
 */
window.QUESTION_SCREEN_SESSION = {
  meta: {
    title: "NR-11 — Operação de Paleteira Manual",
    brand: "TecnoCursos",
    musicSrc: "musica/musica_foco.mp3"
  },
  modules: [
    {
      id: 1,
      title: "Fundamentos Legais, Requisitos do Operador e Especificações do Equipamento",
      objective: "Capacitar sobre as exigências da NR-11, o credenciamento do operador, as restrições de uso, a ficha técnica da paleteira e a inspeção pré-turno.",
      titleUnlock: {
        title: "OPERADOR HABILITADO",
        body: "Você conhece a NR-11, os limites da paleteira e a inspeção antes de cada turno.",
        icon: "🪪"
      },
      screens: [
        {
          id: "nr11-m1-capa",
          type: "cover",
          image: "assets/fotos/capa-modulo1.png",
          imageAlt: "Capa do módulo 1",
          title: "Módulo 1 — Fundamentos legais e o equipamento",
          subtitle: "NR-11, habilitação do operador, o que este treinamento não autoriza, ficha técnica e checklist pré-turno."
        },
        {
          id: "nr11-m1-objetivo",
          type: "video",
          kicker: "Vídeo",
          title: "Apresentação do Curso, Objetivo e Conteúdo Programático",
          playerId: "panda-5803b869-77c2-4287-883f-53e15a3e13bd",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=5803b869-77c2-4287-883f-53e15a3e13bd"
        },
        {
          id: "nr11-m1-nr11",
          type: "content",
          fit: true,
          kicker: "NR-11",
          title: "O que a NR-11 cobra aqui",
          body: "Três pontos da norma sustentam este treinamento da paleteira manual.",
          cards: [
            { icon: "1", title: "11.1 — Máquinas transportadoras", body: "A paleteira entra no subitem 11.1, que trata de transporte mecanizado de materiais." },
            { icon: "2", title: "11.1.3.2 — Carga máxima visível", body: "A indicação da carga máxima tem de estar visível no equipamento." },
            { icon: "3", title: "11.1.5 — Treinamento da empresa", body: "A operação exige treinamento específico oferecido pelo empregador." }
          ],
          note: { label: "Lembrete", text: "Sem treinamento específico, a operação da paleteira é proibida." }
        },
        {
          id: "nr11-m1-operador",
          type: "content",
          layout: "qualify",
          kicker: "3 requisitos",
          title: "Quem pode operar",
          body: "Toque em cada requisito. Saúde, treino e reciclagem precisam estar em dia ao mesmo tempo.",
          picks: [
            {
              n: "01",
              icon: "🩺",
              title: "ASO em dia",
              lead: "Aptidão médica",
              body: "A pessoa precisa estar apta do ponto de vista médico, com Atestado de Saúde Ocupacional válido.",
              points: ["Sem ASO válido, a paleteira não sai.", "Vale a data do documento, não a memória de quem opera."]
            },
            {
              n: "02",
              icon: "📚",
              title: "Teoria e prática",
              lead: "Antes de operar",
              body: "O treinamento teórico e o prático acontecem antes da primeira operação real.",
              points: ["Aula só teórica não habilita.", "A prática vem antes de conduzir carga de verdade."]
            },
            {
              n: "03",
              icon: "🔄",
              title: "Reciclagem anual",
              lead: "Todo ano",
              body: "A autorização se mantém com reciclagem anual. Vencida, equivale a não ter autorização.",
              points: ["O treinamento é refeito todo ano.", "Carteirinha vencida não autoriza o turno."]
            }
          ]
        },
        {
          id: "nr11-m1-credencial",
          type: "video",
          kicker: "Vídeo",
          title: "Credenciamento, Validade da Autorização e Restrições de Operação",
          playerId: "panda-1fc96c3c-b63e-46d5-bd3a-de22eb4277d0",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=1fc96c3c-b63e-46d5-bd3a-de22eb4277d0"
        },
        {
          id: "nr11-m1-definicao",
          type: "video",
          kicker: "Vídeo",
          title: "Conhecendo a Paleteira Manual e Especificações Técnicas",
          playerId: "panda-f036c33f-2f61-4428-8489-1bf090a9e30d",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=f036c33f-2f61-4428-8489-1bf090a9e30d"
        },
        {
          id: "nr11-m1-ficha",
          type: "content",
          fit: true,
          kicker: "Ficha técnica",
          title: "Limites do fabricante",
          body: "Estes números são o teto do equipamento. Passou disso, a operação está fora do padrão.",
          stats: [
            { num: "2.500 kg", label: "Capacidade máxima de carga" },
            { num: "80 mm", label: "Garfos abaixados" },
            { num: "200 mm", label: "Garfos elevados" }
          ],
          cards: [
            { icon: "📏", title: "Garfos", body: "Comprimento útil 1.220 mm. Largura de cada garfo 165 mm." },
            { icon: "↔️", title: "Comprimento total", body: "1.670 mm, da ponta dos garfos até o conjunto de direção." }
          ],
          quote: "Capacidade máxima: 2.500 kg. Carga acima disso não entra na paleteira."
        },
        {
          id: "nr11-m1-checklist",
          type: "video",
          kicker: "Vídeo",
          title: "Inspeção antes de cada turno",
          playerId: "panda-385ac457-86ad-4a99-858f-6922ddc2fe08",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=385ac457-86ad-4a99-858f-6922ddc2fe08"
        },
        {
          id: "nr11-m1-desafio",
          type: "quiz-intro",
          title: "Turno liberado?",
          body: "Um jogo rápido: classifique cada situação em <strong>Pode operar</strong> ou <strong>Não opera</strong>. Acerte no mínimo <strong>6</strong> de <strong>8</strong> para avançar.",
          count: 8,
          minCorrect: 6,
          icon: "🎮"
        },
        {
          id: "nr11-m1-turno",
          type: "sort",
          title: "Turno liberado?",
          body: "Leia a situação e escolha o lado certo antes do tempo acabar.",
          time: 70,
          minCorrect: 6,
          review: "Quem pode operar, o limite de 2.500 kg e a interdição quando há defeito",
          left: { id: "nok", label: "Não opera", icon: "⛔" },
          right: { id: "ok", label: "Pode operar", icon: "✅" },
          items: [
            {
              text: "ASO em dia, treino teórico e prático feito e reciclagem anual válida.",
              bin: "ok"
            },
            {
              text: "Paleteira manual hidráulica, conduzida a pé, com carga de 1.800 kg.",
              bin: "ok"
            },
            {
              text: "Checklist feito: equipamento limpo, placas legíveis e nenhum defeito aparente.",
              bin: "ok"
            },
            {
              text: "Carga estável que cabe nos garfos de 1.220 mm, dentro de 2.500 kg.",
              bin: "ok"
            },
            {
              text: "ASO vencido.",
              bin: "nok",
              hint: "Sem ASO em dia, a pessoa não opera."
            },
            {
              text: "Carteirinha de operador vencida.",
              bin: "nok",
              hint: "Autorização vencida não vale para o turno."
            },
            {
              text: "Defeito na roda. A ideia é usar assim mesmo porque a carga é leve.",
              bin: "nok",
              hint: "Defeito é interdição na hora. Não use e avise a manutenção."
            },
            {
              text: "Palete com 3.200 kg.",
              bin: "nok",
              hint: "A capacidade máxima desta paleteira é 2.500 kg."
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Condução Segura, Ergonomia, Regras de Trânsito e Operação em Rampas",
      objective: "Ensinar a postura de condução, a velocidade adequada, as regras de circulação interna e a forma segura de manobrar em ré e em rampas.",
      titleUnlock: {
        title: "CONDUÇÃO SEGURA",
        body: "Você empurra a paleteira, respeita o trânsito interno e desce rampa com a carga do jeito certo.",
        icon: "🚶"
      },
      screens: [
        {
          id: "nr11-m2-capa",
          type: "cover",
          image: "assets/fotos/capa-modulo2.png",
          imageAlt: "Capa do módulo 2",
          title: "Módulo 2 — Condução, ergonomia e rampas",
          subtitle: "Velocidade de caminhada, empurrar em vez de puxar, proibições, trânsito interno e rampas."
        },
        {
          id: "nr11-m2-ritmo",
          type: "video",
          kicker: "Vídeo",
          title: "Ergonomia, Postura e Velocidade na Condução",
          playerId: "panda-dfeea8fa-de56-4224-a82a-84d8a0402f92",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=dfeea8fa-de56-4224-a82a-84d8a0402f92"
        },
        {
          id: "nr11-m2-ergonomia",
          type: "video",
          kicker: "Vídeo",
          title: "Proibições Severas na Operação e Riscos por Distração",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=2921ef2d-b8c5-4d51-9cf4-d5137b40b5b2"
        },
        {
          id: "nr11-m2-proibicoes",
          type: "content",
          fit: true,
          kicker: "Proibido",
          title: "O que não se faz com a paleteira",
          items: [
            { icon: "🚫", text: "Operar em pé sobre os garfos ou sobre a estrutura." },
            { icon: "🚫", text: "Usar a paleteira como escada ou plataforma de trabalho." },
            { icon: "🚫", text: "Transportar pessoas ou dar carona." },
            { icon: "🚫", text: "Sentar-se sobre a bateria ou sobre a estrutura." },
            { icon: "🚫", text: "Usar telefone celular durante a condução." }
          ],
          quote: "Paleteira transporta carga, não gente."
        },
        {
          id: "nr11-m2-transito",
          type: "video",
          kicker: "Vídeo",
          title: "Regras de Trânsito Interno e Circulação em Galpões",
          playerId: "panda-83deb05a-af44-479d-9e3f-9675b916ff74",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=83deb05a-af44-479d-9e3f-9675b916ff74"
        },
        {
          id: "nr11-m2-rampas",
          type: "video",
          kicker: "Vídeo",
          title: "Subida, descida e o que é proibido",
          playerId: "panda-e6ade649-b3f9-47bd-91c8-20282d6abe94",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=e6ade649-b3f9-47bd-91c8-20282d6abe94"
        },
        {
          id: "nr11-m2-desafio",
          type: "quiz-intro",
          title: "Desafio NR-11 — Módulo 2",
          count: 3,
          minCorrect: 2,
          icon: "🎮"
        },
        {
          id: "nr11-m2-p1",
          type: "question",
          icon: "🚶",
          image: "assets/fotos/m2i1.png",
          imageAlt: "Operador em pé com a paleteira manual no corredor",
          question: "Qual é a forma ergonômica de conduzir a paleteira manual?",
          alternatives: [
            { id: "a", text: "Puxar o tempo todo, de costas para o caminho", correct: false },
            { id: "b", text: "Empurrar, com o corpo à frente da alavanca de direção", correct: true },
            { id: "c", text: "Andar ao lado, segurando um garfo", correct: false },
            { id: "d", text: "Sentar na estrutura e empurrar com o pé", correct: false }
          ],
          explanation: "Empurrar preserva a coluna e coloca o operador à frente da alavanca, com visibilidade e controle.",
          review: "A postura de empurrar"
        },
        {
          id: "nr11-m2-p2",
          type: "question",
          icon: "⛰️",
          image: "assets/fotos/m2i2.png",
          imageAlt: "Operador conduzindo a paleteira com carga em uma rampa",
          question: "Como a carga deve ficar na rampa?",
          alternatives: [
            { id: "a", text: "Sempre de lado, para enxergar os dois sentidos", correct: false },
            { id: "b", text: "Na subida, carga à frente; na descida, carga atrás e devagar", correct: true },
            { id: "c", text: "Na descida, carga à frente e em velocidade de caminhada rápida", correct: false },
            { id: "d", text: "Tanto faz, desde que as rodas estejam limpas", correct: false }
          ],
          explanation: "Sobe com a carga na frente. Desce devagar com a carga atrás. Não atravesse nem estacione na inclinação.",
          review: "A direção da carga na rampa"
        },
        {
          id: "nr11-m2-p3",
          type: "question",
          icon: "📱",
          image: "assets/fotos/m2i3.png",
          imageAlt: "Operador empurrando a paleteira com palete de caixas",
          question: "Qual conduta é permitida durante a condução?",
          alternatives: [
            { id: "a", text: "Falar ao celular com a paleteira em movimento", correct: false },
            { id: "b", text: "Dar carona a um colega nos garfos", correct: false },
            { id: "c", text: "Caminhar à frente da alavanca, sem celular e sem passageiro", correct: true },
            { id: "d", text: "Subir nos garfos para alcançar uma prateleira", correct: false }
          ],
          explanation: "Celular, carona e uso como escada ou plataforma são proibidos. A condução é a pé, empurrando.",
          review: "As proibições de condução"
        }
      ]
    },
    {
      id: 3,
      title: "Movimentação de Cargas, Paletes, Armazenamento e Estacionamento",
      objective: "Ensinar a captar e estabilizar a carga, escolher o palete, respeitar o piso e estacionar sem bloquear emergência.",
      titleUnlock: {
        title: "CARGA ESTÁVEL",
        body: "Você escolhe o palete, transporta na altura certa e não bloqueia saída nem hidrante.",
        icon: "📦"
      },
      screens: [
        {
          id: "nr11-m3-capa",
          type: "cover",
          image: "assets/fotos/capa-modulo3.png",
          imageAlt: "Capa do módulo 3",
          title: "Módulo 3 — Cargas, paletes e estacionamento",
          subtitle: "Captação, amarração, altura do solo, paletes de 2 e 4 entradas, piso e onde estacionar."
        },
        {
          id: "nr11-m3-captacao",
          type: "video",
          kicker: "Vídeo",
          title: "Captação, Estabilização e Altura da Carga",
          playerId: "panda-613f3feb-8556-4cd4-88af-95ac0cd4ed00",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=613f3feb-8556-4cd4-88af-95ac0cd4ed00"
        },
        {
          id: "nr11-m3-altura",
          type: "video",
          kicker: "Vídeo",
          title: "Regras de Armazenamento e Limites Estruturais do Piso",
          playerId: "panda-0acc37f0-8d41-4789-97d6-9605e041c175",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=0acc37f0-8d41-4789-97d6-9605e041c175"
        },
        {
          id: "nr11-m3-paletes",
          type: "content",
          fit: true,
          layout: "duo",
          kicker: "Paletes",
          title: "Duas entradas ou quatro",
          body: "O palete é o apoio: uma estrutura com aberturas para os garfos. A entrada muda a manobra.",
          compare: [
            { ok: false, label: "Duas entradas", image: "assets/fotos/PALLET%202.png", imageAlt: "Palete de duas entradas", text: "Aberturas em lados opostos. A paleteira só entra por esses lados, e a manobra fica limitada." },
            { ok: true, label: "Quatro entradas", image: "assets/fotos/PALLET%204.webp", imageAlt: "Palete de quatro entradas", text: "Aberturas nos quatro lados. Os garfos entram em qualquer direção e a manobra no corredor estreito fica mais fácil." }
          ],
          note: { label: "Vazio", text: "No máximo 10 paletes sobrepostos para movimentar sem carga." }
        },
        {
          id: "nr11-m3-piso",
          type: "video",
          kicker: "Vídeo",
          title: "Estacionamento Seguro e Desobstrução de Emergências",
          playerId: "panda-6891e9bf-1d28-4e12-abe6-1a2907a85962",
          embed: "https://player-vz-d35edf2a-8e7.tv.pandavideo.com.br/embed/?v=6891e9bf-1d28-4e12-abe6-1a2907a85962"
        },
        {
          id: "nr11-m3-estacionar",
          type: "content",
          fit: true,
          layout: "spots",
          kicker: "Estacionamento",
          title: "Onde a paleteira pode parar",
          body: "Estacione só em local permitido e disponível. O resto do galpão não é vaga.",
          items: [
            { icon: "🚪", title: "Saída", text: "Emergência e rota de fuga ficam livres." },
            { icon: "🧯", title: "Incêndio", text: "Hidrante e extintor sem nada na frente." },
            { icon: "⚡", title: "Energia", text: "Painel elétrico com acesso livre." },
            { icon: "🚶", title: "Circulação", text: "Via de pedestre, rua e prateleira desobstruídas." }
          ],
          quote: "Se alguém precisa passar ou combater um incêndio, a paleteira não pode estar no caminho."
        },
        {
          id: "nr11-m3-desafio",
          type: "quiz-intro",
          title: "Verdadeiro ou falso",
          body: "Uma frase por vez. Toque em <strong>Verdadeiro</strong> ou <strong>Falso</strong>. São 6 frases da carga, do palete, do piso e do estacionamento. Acerte pelo menos <strong>4</strong>.",
          count: 6,
          minCorrect: 4,
          icon: "✅"
        },
        {
          id: "nr11-m3-vf",
          type: "sort",
          title: "Verdadeiro ou falso",
          body: "Uma frase por vez. Toque no botão certo.",
          time: 75,
          minCorrect: 4,
          review: "Altura da carga, palete, piso e estacionamento",
          left: { id: "falso", label: "Falso", icon: "✕" },
          right: { id: "verdadeiro", label: "Verdadeiro", icon: "✓" },
          items: [
            {
              text: "No piso regular, a base da carga fica a 15–20 cm do solo.",
              bin: "verdadeiro",
              hint: "Verdade. Essa é a altura de transporte."
            },
            {
              text: "Peça solta pode seguir sem fitilho nem fita stretch.",
              bin: "falso",
              hint: "Falso. Peça solta precisa de amarração."
            },
            {
              text: "Paletes de madeira vazios: no máximo 10 empilhados.",
              bin: "verdadeiro",
              hint: "Verdade. O limite é de 10 paletes vazios."
            },
            {
              text: "O palete de duas entradas abre nos quatro lados.",
              bin: "falso",
              hint: "Falso. Duas entradas só abrem em lados opostos."
            },
            {
              text: "No corredor, deixe pelo menos 50 cm livres.",
              bin: "verdadeiro",
              hint: "Verdade. Esse espaço livre é obrigatório."
            },
            {
              text: "Pode estacionar na frente da saída de emergência.",
              bin: "falso",
              hint: "Falso. Saída, hidrante e extintor ficam livres."
            }
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Riscos Operacionais, Manutenção, EPIs e Procedimentos de Emergência",
      objective: "Reconhecer falhas que causam acidente, não consertar o equipamento por conta própria, usar os EPIs e agir no alarme de incêndio.",
      titleUnlock: {
        title: "PRONTO PARA A EMERGÊNCIA",
        body: "Você alinha o palete, usa os EPIs, não faz conserto caseiro e sabe o que fazer no alarme.",
        icon: "⛑️"
      },
      screens: [
        {
          id: "nr11-m4-capa",
          type: "cover",
          icon: "⛑️",
          title: "Módulo 4 — Riscos, EPIs e emergência",
          subtitle: "Palete mal alinhado, manutenção, equipamentos de proteção e o que fazer no incêndio."
        },
        {
          id: "nr11-m4-alinhamento",
          type: "content",
          fit: true,
          kicker: "Risco",
          title: "Palete mal alinhado derruba carga",
          body: "Garfo que não entra até o fim deixa o palete longe da base da paleteira. A carga fica em balanço.",
          compare: [
            { ok: true, label: "Certo", text: "Garfos completamente sob o palete, carga centrada e estável, perto da base do equipamento." },
            { ok: false, label: "Errado", text: "Palete mal alinhado e distante da base. A folga nos garfos desequilibra e a queda da carga é iminente." }
          ]
        },
        {
          id: "nr11-m4-outros",
          type: "content",
          fit: true,
          kicker: "Risco",
          title: "Outros perigos na movimentação",
          cards: [
            { icon: "👁️", title: "Carga alta", body: "Tira a visão do trajeto. Sem visibilidade, pare e peça ajuda. Não avance no escuro." },
            { icon: "🛢️", title: "Piso traiçoeiro", body: "Molhado, oleoso ou com desnível aumenta a derrapagem. Reduza e confira as rodas." },
            { icon: "📢", title: "Anomalia", body: "Vazamento, ruído ou folga: pare, não force e avise a chefia ou a manutenção na hora." }
          ]
        },
        {
          id: "nr11-m4-manutencao",
          type: "content",
          fit: true,
          kicker: "Manutenção",
          title: "Operador não conserta",
          body: "Sem treinamento específico de manutenção, mexer na paleteira é proibido.",
          cards: [
            { icon: "🚫", title: "Não repare", body: "Não tente consertar hidráulica, roda ou estrutura por conta própria." },
            { icon: "📣", title: "Informe", body: "Qualquer ocorrência, anomalia ou vazamento vai imediatamente à chefia ou à manutenção." },
            { icon: "🔒", title: "Fora de uso", body: "Equipamento com defeito permanece interditado até a liberação de quem é responsável." }
          ],
          quote: "Conserto caseiro vira o próximo acidente."
        },
        {
          id: "nr11-m4-epi",
          type: "content",
          fit: true,
          kicker: "EPI",
          title: "Proteção o turno inteiro",
          body: "A empresa fornece, orienta, treina e exige. O operador usa do início ao fim da jornada.",
          cards: [
            { icon: "👢", title: "Botina", body: "Botina de segurança com biqueira." },
            { icon: "🧤", title: "Luvas", body: "Luvas tricotadas de segurança e luvas de vaqueta ou raspa, conforme a tarefa." },
            { icon: "⛑️", title: "Capacete", body: "Capacete de segurança com jugular ajustada." }
          ],
          note: { label: "Durante a operação", text: "EPI no armário não protege. Capacete sem jugular não conta como usado." }
        },
        {
          id: "nr11-m4-incendio",
          type: "content",
          fit: true,
          kicker: "Emergência",
          title: "Alarme de incêndio",
          items: [
            { n: "1", title: "Pare", text: "Ao ouvir o alarme, estacione imediatamente em local seguro." },
            { n: "2", title: "Baixe a carga", text: "Desça a carga e deixe a passagem livre." },
            { n: "3", title: "Saia e acione", text: "Conheça o extintor da área e saiba chamar os brigadistas." }
          ],
          note: { label: "Princípio de incêndio", text: "Peça ajuda e comunique a Brigada. Só inicie o combate com extintor se você for brigadista treinado, usando pó químico ou CO2, o adequado ao fogo." }
        },
        {
          id: "nr11-m4-desafio",
          type: "quiz-intro",
          title: "Desafio NR-11 — Módulo 4",
          count: 3,
          minCorrect: 2,
          icon: "🎮"
        },
        {
          id: "nr11-m4-p1",
          type: "question",
          icon: "⚠️",
          question: "Por que o palete mal alinhado e longe da base é perigoso?",
          alternatives: [
            { id: "a", text: "Só atrasa a entrega, sem risco de queda", correct: false },
            { id: "b", text: "Desequilibra a carga e pode derrubá-la", correct: true },
            { id: "c", text: "É o jeito certo de entrar em corredor estreito", correct: false },
            { id: "d", text: "Aumenta a capacidade para mais de 2.500 kg", correct: false }
          ],
          explanation: "A folga nos garfos tira o apoio. A carga fica em balanço e a queda é iminente.",
          review: "O risco do palete mal alinhado"
        },
        {
          id: "nr11-m4-p2",
          type: "question",
          icon: "🔧",
          question: "A paleteira começa a vazar óleo. O que o operador faz?",
          alternatives: [
            { id: "a", text: "Aperta a conexão e termina as entregas", correct: false },
            { id: "b", text: "Para, interdita e informa a chefia ou a manutenção", correct: true },
            { id: "c", text: "Limpa o óleo e segue, se a carga for baixa", correct: false },
            { id: "d", text: "Pede para outro operador usar o mesmo equipamento", correct: false }
          ],
          explanation: "Operador não faz manutenção. Anomalia ou vazamento é comunicação imediata e equipamento fora de uso.",
          review: "A proibição de conserto"
        },
        {
          id: "nr11-m4-p3",
          type: "question",
          icon: "🔥",
          question: "O alarme de incêndio dispara enquanto você conduz. Qual é a primeira sequência?",
          alternatives: [
            { id: "a", text: "Terminar a entrega e só então sair", correct: false },
            { id: "b", text: "Estacionar em local seguro, baixar a carga e liberar a passagem", correct: true },
            { id: "c", text: "Abandonar a paleteira no meio do corredor, com a carga elevada", correct: false },
            { id: "d", text: "Subir na carga para enxergar de onde vem o alarme", correct: false }
          ],
          explanation: "Estacione em local seguro, baixe a carga e garanta a passagem. Combate com extintor é para brigadista treinado.",
          review: "A conduta no alarme de incêndio"
        },
        {
          id: "nr11-m4-final",
          type: "finale",
          kicker: "Conclusão",
          eyebrow: "Treinamento concluído",
          title: "Parabéns",
          body: "Você concluiu o treinamento NR-11 de operação de paleteira manual.",
          quote: "Carteirinha válida, checklist feito, carga estável e passagem livre.",
          chips: ["NR-11", "Paleteira manual", "2.500 kg"]
        }
      ]
    }
  ]
};
