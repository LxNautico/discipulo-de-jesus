/* Jornada e leitor online. */
(() => {
  const data = window.BIBLE_CATALOG;
  const reader = window.createBibleReader;
  const nav = document.querySelector("nav");
  const button = document.createElement("button");
  button.dataset.view = "biblia"; button.textContent = "▤   Bíblia no jogo";
  nav.insertBefore(button, nav.children[1]);
  const originalRender = render;
  render = function() {
    originalRender();
    if(view === "biblia") {
      app.innerHTML = intro("A PALAVRA NO CENTRO", "Sua Bíblia, dentro da jornada.", "A ARA é a base da jornada. Gênesis está disponível sem internet; outros livros e versões podem ser consultados no Bible.com.");
      const host = document.createElement("section"); host.className = "card bible-reader"; app.append(host); reader(host);
    }
  };
  const readings = [
    [{ book: 'GEN', fromChapter: 1, fromVerse: 1, toChapter: 2, toVerse: 3 }],
    [{ book: 'GEN', fromChapter: 3, fromVerse: 1, toChapter: 3, toVerse: 24 }],
    [{ book: 'GEN', fromChapter: 4, fromVerse: 1, toChapter: 4, toVerse: 16 }],
    [{ book: 'GEN', fromChapter: 6, fromVerse: 5, toChapter: 6, toVerse: 22 }, { book: 'GEN', fromChapter: 9, fromVerse: 1, toChapter: 9, toVerse: 17 }],
    [{ book: 'GEN', fromChapter: 11, fromVerse: 1, toChapter: 11, toVerse: 9 }],
    [{ book: 'GEN', fromChapter: 12, fromVerse: 1, toChapter: 12, toVerse: 9 }],
    [{ book: 'GEN', fromChapter: 26, fromVerse: 1, toChapter: 26, toVerse: 6 }, { book: 'GEN', fromChapter: 26, fromVerse: 12, toChapter: 26, toVerse: 25 }],
    [{ book: 'GEN', fromChapter: 28, fromVerse: 10, toChapter: 28, toVerse: 22 }, { book: 'GEN', fromChapter: 32, fromVerse: 22, toChapter: 32, toVerse: 32 }],
    [{ book: 'GEN', fromChapter: 45, fromVerse: 1, toChapter: 45, toVerse: 15 }, { book: 'GEN', fromChapter: 50, fromVerse: 15, toChapter: 50, toVerse: 21 }],
    [{ book: 'EXO', fromChapter: 3, fromVerse: 1, toChapter: 3, toVerse: 12 }],
    [{ book: 'EXO', fromChapter: 12, fromVerse: 1, toChapter: 12, toVerse: 14 }, { book: 'EXO', fromChapter: 12, fromVerse: 21, toChapter: 12, toVerse: 28 }],
    [{ book: 'EXO', fromChapter: 12, fromVerse: 29, toChapter: 12, toVerse: 42 }, { book: 'EXO', fromChapter: 13, fromVerse: 17, toChapter: 13, toVerse: 22 }],
    [{ book: 'EXO', fromChapter: 14, fromVerse: 10, toChapter: 14, toVerse: 31 }],
    [{ book: 'EXO', fromChapter: 19, fromVerse: 1, toChapter: 19, toVerse: 8 }, { book: 'EXO', fromChapter: 20, fromVerse: 1, toChapter: 20, toVerse: 17 }],
    [{ book: 'EXO', fromChapter: 16, fromVerse: 1, toChapter: 16, toVerse: 18 }, { book: 'EXO', fromChapter: 16, fromVerse: 19, toChapter: 16, toVerse: 30 }],
    [{ book: 'JOS', fromChapter: 1, fromVerse: 1, toChapter: 1, toVerse: 18 }],
    [{ book: 'JDG', fromChapter: 2, fromVerse: 6, toChapter: 2, toVerse: 23 }],
    [{ book: 'RUT', fromChapter: 1, fromVerse: 14, toChapter: 1, toVerse: 22 }, { book: 'RUT', fromChapter: 2, fromVerse: 8, toChapter: 2, toVerse: 12 }, { book: 'RUT', fromChapter: 4, fromVerse: 13, toChapter: 4, toVerse: 22 }],
    [{ book: 'MAT', fromChapter: 5, fromVerse: 1, toChapter: 5, toVerse: 16 }],
    [{ book: 'MAT', fromChapter: 28, fromVerse: 16, toChapter: 28, toVerse: 20 }, { book: 'ACT', fromChapter: 2, fromVerse: 42, toChapter: 2, toVerse: 47 }]
  ];
  const originalOpen = openLesson;
  openLesson = function (i) {
    originalOpen(i);
    const body = document.querySelector('#lesson-body');
    const prompt = body.querySelector('p');
    prompt.textContent = 'Leia a passagem abaixo e depois continue o estudo. Você pode navegar pelo capítulo completo.';
    readings[i].forEach(r => {
      const details = document.createElement('details'); details.className = 'lesson-bible'; details.open = true;
      const summary = document.createElement('summary');
      const b = data?.books.find(b => b.id === r.book);
      summary.textContent = `${b?.name || r.book} ${r.fromChapter}:${r.fromVerse}–${r.toChapter === r.fromChapter ? '' : r.toChapter + ':'}${r.toVerse} · Ler no jogo`;
      details.append(summary); const host = document.createElement('div'); details.append(host);
      reader(host, r.book, r.fromChapter, r); prompt.before(details);
    });
  };
  render();
})();
