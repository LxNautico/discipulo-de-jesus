/* Caminho de formação: uma organização dos recursos existentes do jogo. */
(() => {
  const module=(id,level,title,summary,resources)=>({id,level,title,summary,resources});
  window.DISCIPLESHIP_PATH={
    levels:[
      {id:'fundamentos',number:1,title:'Novo convertido',description:'Conheça o evangelho e estabeleça hábitos simples de leitura e oração.'},
      {id:'vida-comunidade',number:2,title:'Discípulo',description:'Aprenda a viver a nova fé em santidade, comunhão e serviço.'},
      {id:'servico-ensino',number:3,title:'Líder',description:'Sirva com humildade e aprofunde os fundamentos que você poderá ensinar.'},
      {id:'leitura-teologica',number:4,title:'Mestre',description:'Leia a Bíblia com visão do todo e conheça perguntas da teologia cristã.'},
      {id:'multiplicacao',number:5,title:'Fazedor de discípulos',description:'Compartilhe o evangelho, caminhe com pessoas e participe da missão.'}
    ],
    modules:[
      module('evangelho','fundamentos','O evangelho e a nova vida','Comece pela história de Deus, pela graça em Cristo e pela resposta de fé.',[{view:'jornada',lesson:0,label:'Jornada · No princípio, Deus'},{view:'jornada',lesson:18,label:'Jornada · O Reino e o Sermão do Monte'},{view:'livros',label:'Panorama · Evangelhos'}]),
      module('biblia','fundamentos','Ler a Bíblia','Aprenda a localizar textos, ler capítulos em contexto e reconhecer a grande história bíblica.',[{view:'jornada',lesson:0,label:'Jornada · Criação e queda'},{view:'livros',label:'Livros da Bíblia · panorama'},{view:'biblia',label:'Bíblia no jogo · ARA e Bible.com'}]),
      module('oracao','fundamentos','Oração e comunhão com Deus','Use os salmos, os evangelhos e a sua própria reflexão para cultivar uma conversa honesta com Deus.',[{view:'biblia',label:'Bíblia no jogo · Salmos e Evangelhos online'},{view:'temas',label:'Vida e Palavra · leituras e reflexões'},{view:'jornada',lesson:19,label:'Jornada · A missão continua'}]),
      module('santificacao','vida-comunidade','Santificação no cotidiano','Observe como a fé alcança decisões, hábitos, relações e o cuidado com o próximo.',[{view:'temas',label:'Vida e Palavra · aplicações práticas'},{view:'jornada',lesson:1,label:'Jornada · A ruptura e a promessa'},{view:'livros',label:'Livros · cartas do Novo Testamento'}]),
      module('igreja','vida-comunidade','Igreja e comunhão','Entenda a igreja como povo de Deus que aprende, serve, corrige e celebra junto.',[{view:'jornada',lesson:19,label:'Jornada · A missão continua'},{view:'livros',label:'Livros · Atos e cartas'},{view:'pessoas',label:'Pessoas da Bíblia · histórias e contextos'}]),
      module('servico','vida-comunidade','Serviço e dons','Conecte aprendizado bíblico com serviço prático, generosidade e responsabilidade.',[{view:'temas',label:'Vida e Palavra · Dinheiro e generosidade'},{view:'jornada',lesson:17,label:'Jornada · Rute e a fidelidade'},{view:'teologos',label:'Teólogos · igreja, vocação e serviço'}]),
      module('doutrinas','servico-ensino','Doutrinas essenciais','Aprenda a reconhecer que doutrinas procuram resumir o ensino bíblico e devem ser examinadas nas Escrituras.',[{view:'teologia',label:'Estudo teológico · comparações introdutórias'},{view:'teologos',label:'Teólogos · ideias e obras'},{view:'livros',label:'Livros · contexto das cartas'}]),
      module('ensino','servico-ensino','Ensinar com responsabilidade','Pratique explicar um texto com clareza, contexto e humildade, sem substituir a leitura bíblica.',[{view:'livros',label:'Livros da Bíblia · contexto e roteiro'},{view:'teologos',label:'Teólogos · leitura crítica'},{view:'biblia',label:'Bíblia no jogo · leitura em contexto'}]),
      module('teologia-biblica','leitura-teologica','Teologia bíblica','Acompanhe temas que se desenvolvem da criação à nova criação, respeitando o lugar de cada livro na história.',[{view:'jornada',label:'Jornada · a grande história em 20 estudos'},{view:'livros',label:'Livros da Bíblia · panorama dos 66 livros'},{view:'pesquisa',label:'Pesquisa bíblica · palavras em Gênesis ARA'}]),
      module('teologia-sistematica','leitura-teologica','Teologia sistemática','Compare como cristãos organizam questões sobre Deus, salvação, igreja e vida cristã.',[{view:'teologia',label:'Estudo teológico · perspectivas'},{view:'teologos',label:'Teólogos · tradições e contribuições'},{view:'livros',label:'Livros · cartas e gêneros bíblicos'}]),
      module('hermeneutica','leitura-teologica','Como interpretar com cuidado','Leia observando gênero, contexto histórico, fluxo do livro e a relação entre texto e aplicação.',[{view:'livros',label:'Livros da Bíblia · roteiro e contexto'},{view:'biblia',label:'Bíblia no jogo · leia o capítulo completo'},{view:'teologos',label:'Teólogos · avalie ideias pelas Escrituras'}]),
      module('evangelismo','multiplicacao','Evangelismo','Prepare-se para compartilhar a esperança cristã com clareza, respeito e atenção à pessoa que escuta.',[{view:'jornada',lesson:19,label:'Jornada · A missão continua'},{view:'livros',label:'Livros · Evangelhos e Atos'},{view:'temas',label:'Vida e Palavra · conversas do cotidiano'}]),
      module('mentoria','multiplicacao','Missões e mentoria','Caminhe com outras pessoas, encoraje o amadurecimento e participe da missão da igreja.',[{view:'pessoas',label:'Pessoas da Bíblia · aprender com histórias'},{view:'teologos',label:'Teólogos · igreja e missão'},{view:'jornada',label:'Jornada · revisar a grande história'}])
    ]
  };
})();
