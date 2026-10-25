/* Contagem por palavra inteira; sem misturar traduções, flexões ou temas. */
(() => {
  const common = new Set('a o as os um uma uns umas de do da dos das em no na nos nas ao aos à às e ou mas que se por para com sem não sim é era eram foi foram ser são sou eu tu ele ela eles elas nós vós você vocês me te lhe lhes meu minha meus minhas seu sua seus suas nosso nossa nossos nossas este esta estes estas esse essa esses essas isso isto aquilo quem qual quais como quando onde porque pois então até já mais muito todos todas todo toda cada também pelo pela pelos pelas num numa nem vos lo la'.split(' '));
  const normalize = (text, accents = false) => {
    const value = text.normalize('NFC').toLocaleLowerCase('pt-BR');
    return accents ? value.normalize('NFD').replace(/\p{M}/gu, '') : value;
  };
  const tokenize = text => text.normalize('NFC').match(/[\p{L}\p{N}]+/gu) || [];
  function build(data, accents = false) {
    const words = new Map();
    let verseCount = 0, tokenCount = 0;
    data.books.forEach(book => book.chapters.forEach((chapter, i) => chapter.forEach(verse => {
      verseCount++;
      const counts = new Map();
      tokenize(verse.text).forEach(word => { const key = normalize(word, accents); counts.set(key, (counts.get(key) || 0) + 1); tokenCount++; });
      for (const [word, count] of counts) {
        if (!words.has(word)) words.set(word, {word, count:0, matches:[]});
        const entry = words.get(word); entry.count += count;
        entry.matches.push({book:book.id, name:book.name, chapter:i + 1, verse:verse.number, text:verse.text, count});
      }
    })));
    return {words, verseCount, tokenCount};
  }
  function ranking(index, hideCommon = false, accents = false) {
    const hidden = new Set([...common].map(w => normalize(w, accents)));
    return [...index.words.values()].filter(e => !hideCommon || !hidden.has(e.word)).sort((a,b) => b.count-a.count || a.word.localeCompare(b.word,'pt-BR'));
  }
  const api = {normalize, tokenize, build, ranking};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.WordEngine = api;
})();
