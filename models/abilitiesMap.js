const abilitiesMap = [
    {
      Acadêmico: [
        "Saber é Poder.",
        "Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.",
      ],
    },
    {
      AgentedeSaúde: [
        "Técnica Medicinal.",
        "Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.",
      ],
    },
    {
      Amnésico: [
        "Vislumbres do Passado.",
        "Uma vez por sessão, você pode fazer um teste de Intelecto (DT 10) para reconhecer pessoas ou lugares familiares, que tenha encontrado antes de perder a memória. Se passar, recebe 1d4 PE temporários e, a critério do mestre, uma informação útil.",
      ],
    },
    {
      Artista: [
        "Magnum Opus.",
        "Você é famoso por uma de suas obras. Uma vez por missão, pode determinar que um personagem envolvido em uma cena de interação o reconheça. Você recebe +5 em testes de Presença e de perícias baseadas em Presença contra aquele personagem. A critério do mestre, pode receber esses bônus em outras situações nas quais seria reconhecido.",
      ],
    },
    {
      Atleta: [
        "110%.",
        "Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria), você pode gastar 2 PE para receber +5 nesse teste.",
      ],
    },
    {
      Chef: [
        "Ingrediente Secreto.",
        "Em cenas de interlúdio, você pode fazer a ação alimentar-se para cozinhar um prato especial. Você, e todos os membros do grupo que fizeram a ação alimentar-se, recebem o benefício de dois pratos (caso o mesmo benefício seja escolhido duas vezes, seus efeitos se acumulam).",
      ],
    },
    {
      CientistaForense: [
        "Investigação Científica.",
        "Uma vez por cena de investigação, você pode gastar uma ação livre para procurar pistas, usando Ciências no lugar da perícia que seria usada para tentar encontrar a pista em questão.",
      ],
    },
    {
      Criminoso: [
        "O Crime Compensa.",
        "No final de uma missão, escolha um item encontrado na missão. Em sua próxima missão, você pode incluir esse item em seu inventário sem que ele conte em seu limite de itens por patente.",
      ],
    },
    {
      CultistaArrependido: [
        "Traços do Outro Lado.",
        "Você possui um poder paranormal à sua escolha. Porém, começa o jogo com metade da Sanidade normal para sua classe.",
      ],
    },
    { Desgarrado: ["Calejado.", "Você recebe +1 PV para cada 5% de NEX."] },
    {
      Engenheiro: [
        "Ferramentas Favoritas.",
        "Um item a sua escolha (exceto armas) conta como uma categoria abaixo (por exemplo, um item de categoria II conta como categoria I para você.)",
      ],
    },
    {
      Escritor: [
        "Bagagem de Leitura.",
        "Por seu trabalho, você já leu - e aprendeu - de tudo um pouco. Uma vez por cena, pode gastar 2 PE para se tornar treinado em uma perícia qualquer até o fim da cena.",
      ],
    },
    {
      Executivo: [
        "Processo Otimizado.",
        "Sempre que faz um teste de perícia durante um teste estendido, ou uma ação para revisar documentos (físicos ou digitais), pode pagar 2 PE para receber +5 nesse teste.",
      ],
    },
    {
      Investigador: [
        "Faro para Pistas.",
        "Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 1 PE para receber +5 nesse teste.",
      ],
    },
    {
      Jornalista: [
        "Fontes Confiáveis.",
        "Uma vez por sessão de jogo, você pode gastar 1 PE para contatar suas fontes - pessoas com acesso a informações nas quais você confia. Isso permite que você role novamente um teste já realizado para encontrar uma pista, com +5 de bônus, ou receba outra informação relevante (a critério do mestre).",
      ],
    },
    {
      Lutador: [
        "Mão Pesada.",
        "Você recebe +2 em rolagens de dano com ataques corpo a corpo.",
      ],
    },
    {
      Magnata: [
        "Patrocinador da Ordem.",
        "Seu limite de crédito é sempre considerado um acima do atual.",
      ],
    },
    {
      Mercenário: [
        "Posição de Combate.",
        "No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.",
      ],
    },
    {
      Militar: [
        "Para Bellum.",
        "Você recebe +2 em rolagens de dano com armas de fogo.",
      ],
    },
    {
      Operário: [
        "Ferramenta de Trabalho.",
        "Escolha uma arma simples ou tática que, a critério do mestre, poderia ser usada como ferramenta em sua profissão (como uma marreta para um pedreiro). Você sabe usar a arma escolhida e recebe +1 em testes de ataque, rolagens de dano e margem de ameaça com ela.",
      ],
    },
    { Policial: ["Patrulha.", "Você recebe +2 em Defesa."] },
    {
      Professor: [
        "Aula de Campo.",
        "Uma vez por cena, pode gastar uma ação padrão e 2 PE para fornecer +1 em um atributo de outro personagem em alcance curto até o fim da cena.",
      ],
    },
    {
      Religioso: [
        "Acalentar.",
        "Você recebe +5 em testes de Religião para acalmar. Além disso, quando acalma uma pessoa, ela recebe um número de pontos de Sanidade igual a 1d6 + a sua Presença.",
      ],
    },
    {
      ServidorPúblico: [
        "Espírito Cívico.",
        "Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido em +2.",
      ],
    },
    {
      TeóricodaConspiração: [
        "Eu Já Sabia.",
        "Você recebe resistência a dano mental igual ao seu Intelecto.",
      ],
    },
    {
      TI: [
        "Motor de Busca.",
        "A critério do Mestre, sempre que tiver acesso à internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia.",
      ],
    },
    {
      TrabalhadorRural: [
        "Desbravador.",
        "Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5 nesse teste. Além disso, você não sofre penalidade em deslocamento por terreno difícil.",
      ],
    },
    {
      Trambiqueiro: [
        "Impostor.",
        "Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Enganação.",
      ],
    },
    {
      Universitário: [
        "Dedicação.",
        "Você recebe +1 PE, e mais 1 PE adicional a cada NEX ímpar (15%, 25%...). Além disso, seu limite de PE por turno aumenta em 1 (em NEX 5% seu limite é 2, em NEX 10% é 3 e assim por diante; isso não afeta a DT de seus efeitos.",
      ],
    },
    {
      Vítima: [
        "Cicatrizes Psicológicas.",
        "Você recebe +1 de Sanidade para cada 5% de NEX.",
      ],
    },
  ];
  
  export default abilitiesMap;