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
          icon: "🚶",
          title: "Módulo 2 — Condução, ergonomia e rampas",
          subtitle: "Velocidade de caminhada, empurrar em vez de puxar, proibições, trânsito interno e rampas."
        },
        {
          id: "nr11-m2-ritmo",
          type: "content",
          fit: true,
          kicker: "Condução",
          title: "Controle e visibilidade",
          body: "A operação segura mantém o controle do equipamento e a visão da área à frente.",
          cards: [
            { icon: "🚶", title: "Velocidade", body: "Desloque no ritmo de uma pessoa caminhando normalmente. Corrida tira o controle." },
            { icon: "🛑", title: "Parada suave", body: "Proibido parar brusco: pé na roda ou girar a manopla com violência derruba a carga." },
            { icon: "👀", title: "Olhe o caminho", body: "Curva, piso molhado e pouca visibilidade pedem menos velocidade." }
          ],
          quote: "Se você não pararia andando, não pare com a paleteira."
        },
        {
          id: "nr11-m2-ergonomia",
          type: "content",
          fit: true,
          kicker: "Ergonomia",
          title: "Empurrar é melhor",
          body: "A coluna agradece quando a força vai para a frente, com o corpo na frente da alavanca.",
          compare: [
            { ok: true, label: "Empurrar", text: "Preferir sempre empurrar a paleteira. O corpo fica à frente da alavanca de direção: mais visibilidade e mais controle." },
            { ok: false, label: "Puxar o tempo todo", text: "Puxar torce a coluna e esconde o trajeto. Só use a ré quando a manobra exigir, e com o caminho de trás livre." }
          ],
          note: { label: "Ré", text: "Antes de puxar, confirme que o trajeto traseiro está totalmente livre e desobstruído." }
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
          type: "content",
          fit: true,
          kicker: "Trânsito interno",
          title: "Quem passa primeiro",
          cards: [
            { icon: "🚶", title: "Pedestre", body: "Preferência constante a quem está a pé. Evite conversões bruscas." },
            { icon: "✋", title: "Cruzamento", body: "Pare em cruzamentos e conversões. Dê preferência a empilhadeiras e paleteiras carregadas." },
            { icon: "↔️", title: "Corredor", body: "Dê passagem com atenção. Proibido costurar entre obstáculos." },
            { icon: "💧", title: "Piso ruim", body: "Reduza em curvas, pouca visibilidade e pisos molhados, oleosos ou irregulares." }
          ]
        },
        {
          id: "nr11-m2-rampas",
          type: "content",
          fit: true,
          kicker: "Rampas",
          title: "Subida, descida e o que é proibido",
          body: "Evite rampas sempre que houver outro caminho. Se não houver, a carga manda a direção.",
          items: [
            { n: "1", title: "Subir", text: "Inclinação com a carga voltada para a frente." },
            { n: "2", title: "Descer", text: "Devagar, com a carga voltada para trás. Reduza a velocidade na descida." },
            { n: "3", title: "Rodas", text: "Confira se as rodas agarram o solo e se estão limpas de óleo ou graxa." }
          ],
          note: { label: "Proibido na rampa", text: "Atravessar o declive na horizontal, fazer volta em rampa ou estacionar em superfície inclinada." }
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
          icon: "📦",
          title: "Módulo 3 — Cargas, paletes e estacionamento",
          subtitle: "Captação, amarração, altura do solo, paletes de 2 e 4 entradas, piso e onde estacionar."
        },
        {
          id: "nr11-m3-captacao",
          type: "content",
          fit: true,
          kicker: "Carga",
          title: "Antes de levantar",
          items: [
            { n: "1", title: "Peso e tamanho", text: "Confira peso e dimensões. Só movimente o que cabe na capacidade e no tamanho dos garfos." },
            { n: "2", title: "De frente", text: "Aproxime-se de frente e enfie os garfos completamente sob o palete." },
            { n: "3", title: "Estável", text: "Carga arrumada e filmada. Peça solta leva fitilho e/ou fita stretch." }
          ],
          note: { label: "Carga alta", text: "Redobre a atenção. Se precisar de ajudante, combine o trajeto antes de sair." }
        },
        {
          id: "nr11-m3-altura",
          type: "content",
          fit: true,
          kicker: "Transporte",
          title: "Quanto a carga sobe",
          body: "A hidráulica da paleteira manual só faz a elevação básica de transporte. Não é empilhadeira.",
          stats: [
            { num: "15 a 20 cm", label: "Altura da base da carga em piso regular" }
          ],
          cards: [
            { icon: "⬆️", title: "Subir e baixar", body: "Use os comandos só para essa elevação de transporte, não para alcançar prateleira." },
            { icon: "📦", title: "Carga a granel", body: "Material em grande quantidade, sem embalagem, contido só pela carroceria. Não é o caso típico do palete." }
          ],
          quote: "No piso regular, a base da carga fica de 15 a 20 cm do solo."
        },
        {
          id: "nr11-m3-paletes",
          type: "content",
          fit: true,
          kicker: "Paletes",
          title: "Duas entradas ou quatro",
          body: "O palete é o apoio: uma estrutura com aberturas para os garfos. A entrada muda a manobra.",
          compare: [
            { ok: false, label: "Duas entradas", text: "Aberturas em lados opostos. A paleteira só entra por esses lados, e a manobra fica limitada." },
            { ok: true, label: "Quatro entradas", text: "Aberturas nos quatro lados. Os garfos entram em qualquer direção e a manobra em corredor estreito fica mais fácil." }
          ],
          note: { label: "Vazio", text: "No máximo 10 paletes sobrepostos para movimentar sem carga." }
        },
        {
          id: "nr11-m3-piso",
          type: "content",
          fit: true,
          kicker: "Armazenamento",
          title: "O piso também tem limite",
          cards: [
            { icon: "🏗️", title: "Capacidade do pavimento", body: "O peso armazenado nunca pode passar da capacidade calculada para aquele piso." },
            { icon: "🧱", title: "Afastado da parede", body: "Material empilhado não encosta na parede." },
            { icon: "↔️", title: "50 cm livres", body: "Deixe pelo menos 50 cm livres nos corredores de circulação." }
          ]
        },
        {
          id: "nr11-m3-estacionar",
          type: "content",
          fit: true,
          kicker: "Estacionamento",
          title: "Onde a paleteira pode parar",
          body: "Estacione só em local permitido e disponível. O resto do galpão não é vaga.",
          items: [
            { icon: "🚫", text: "Saída de emergência." },
            { icon: "🚫", text: "Hidrante e extintor de incêndio." },
            { icon: "🚫", text: "Painel elétrico." },
            { icon: "🚫", text: "Via de pedestre, rua de acesso ou prateleira." }
          ],
          quote: "Se alguém precisa passar ou combater um incêndio, a paleteira não pode estar no caminho."
        },
        {
          id: "nr11-m3-desafio",
          type: "quiz-intro",
          title: "Desafio NR-11 — Módulo 3",
          count: 3,
          minCorrect: 2,
          icon: "🎮"
        },
        {
          id: "nr11-m3-p1",
          type: "question",
          icon: "📏",
          question: "Em piso regular, a que altura do solo a base da carga deve ficar?",
          alternatives: [
            { id: "a", text: "Rente ao chão, com os garfos abaixados o tempo todo", correct: false },
            { id: "b", text: "De 15 a 20 cm", correct: true },
            { id: "c", text: "Na altura do peito, para ver por baixo", correct: false },
            { id: "d", text: "O mais alto que a hidráulica permitir", correct: false }
          ],
          explanation: "No transporte em terreno regular, a base inferior da carga fica de 15 a 20 cm do solo.",
          review: "A altura de transporte"
        },
        {
          id: "nr11-m3-p2",
          type: "question",
          icon: "🪵",
          question: "Qual palete facilita a manobra em corredor estreito?",
          alternatives: [
            { id: "a", text: "O de duas entradas, porque só tem um caminho", correct: false },
            { id: "b", text: "O de quatro entradas, porque os garfos entram por qualquer lado", correct: true },
            { id: "c", text: "Qualquer palete, desde que esteja molhado", correct: false },
            { id: "d", text: "Palete sem abertura, apoiado só nas pontas dos garfos", correct: false }
          ],
          explanation: "Quatro entradas permitem inserir os garfos em qualquer direção. Duas entradas limitam o acesso.",
          review: "Palete de quatro entradas"
        },
        {
          id: "nr11-m3-p3",
          type: "question",
          icon: "🚒",
          question: "Onde é proibido estacionar a paleteira?",
          alternatives: [
            { id: "a", text: "Na vaga demarcada e disponível", correct: false },
            { id: "b", text: "Na frente de hidrante, extintor, saída de emergência ou painel elétrico", correct: true },
            { id: "c", text: "Ao lado de outra paleteira, na área de estacionamento", correct: false },
            { id: "d", text: "No ponto combinado com a chefia, fora da circulação", correct: false }
          ],
          explanation: "Emergência, combate a incêndio, painel elétrico, pedestre e acesso não são vaga.",
          review: "O estacionamento seguro"
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
