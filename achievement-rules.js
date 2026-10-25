/* Regras puras: conquistas reconhecem atividades, sem conceder XP adicional. */
(() => {
  const catalog=[
    {id:'xp-100',title:'Primeiros Passos',icon:'✧',description:'Acumule 100 XP na jornada bíblica.',goal:100,value:s=>s.xp},
    {id:'xp-500',title:'Explorador da Palavra',icon:'◈',description:'Acumule 500 XP na jornada bíblica.',goal:500,value:s=>s.xp},
    {id:'xp-1000',title:'Aprendiz Perseverante',icon:'✦',description:'Acumule 1.000 XP na jornada bíblica.',goal:1000,value:s=>s.xp},
    {id:'journey-initial',title:'Uma Grande História',icon:'▤',description:'Conclua todos os 20 estudos da trilha histórica inicial.',goal:20,value:s=>s.journeyCompleted},
    {id:'topic-money',title:'Dinheiro e Generosidade',icon:'❧',description:'Conclua as cinco etapas da trilha Dinheiro e generosidade.',goal:5,value:s=>s.moneyCompleted},
    {id:'first-reflection',title:'Primeira Reflexão',icon:'✎',description:'Salve uma reflexão na jornada ou numa trilha temática.',goal:1,value:s=>s.hasReflection?1:0}
  ];
  function evaluate(snapshot,known={},date=new Date().toISOString()){
    const unlocked={};
    for(const badge of catalog)if(typeof known[badge.id]==='string'&&Number.isFinite(Date.parse(known[badge.id])))unlocked[badge.id]=known[badge.id];
    const added=[];
    for(const badge of catalog)if(!unlocked[badge.id]&&badge.value(snapshot)>=badge.goal){unlocked[badge.id]=date;added.push(badge.id);}
    return {unlocked,added};
  }
  const api={catalog,evaluate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.AchievementRules=api;
})();
