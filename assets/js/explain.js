/* Renders a file page: full code first, then block-by-block and line-by-line breakdown. */
(function () {
  'use strict';
  window.EX = window.EX || {};
  Object.assign(window.UI, {
    s_full: ['1. Полный код файла', '1. Файлдың толық коды', '1. Full source of the file'],
    s_break: ['2. Разбор по блокам и строкам', '2. Блоктар мен жолдар бойынша талдау', '2. Block-by-block and line-by-line breakdown'],
    s_say: ['Что сказать на защите', 'Қорғауда не айту керек', 'What to say at the defense'],
    s_qa: ['3. Вопросы, которые могут задать по этому файлу', '3. Осы файл бойынша қойылуы мүмкін сұрақтар', '3. Questions you may get about this file'],
    s_lines: ['строк', 'жол', 'lines'],
    s_role: ['Роль файла', 'Файлдың рөлі', 'Role of the file'],
    s_diff: ['Чем отличается от Task 1', 'Task 1-ден айырмашылығы', 'Difference from Task 1'],
    s_blocks: ['Блоки файла', 'Файл блоктары', 'Blocks of the file'],
    s_answer: ['Ответ', 'Жауап', 'Answer']
  });
  const ORDER = ['data', 'render', 'cases', 'app', 'effects', 'css', 'html'];
  const PAGEFILE = { data: 'file-data.html', render: 'file-render.html', cases: 'file-cases.html', app: 'file-app.html', effects: 'file-effects.html', css: 'file-css.html', html: 'file-html.html' };
  const LABEL = { data: 'data.js', render: 'render.js', cases: 'cases.js', app: 'app.js', effects: 'effects.js', css: 'style.css', html: 'index.html' };

  function range(r) { const p = String(r).split('-'); return [+p[0], +(p[1] || p[0])]; }
  function lineLabel(a, b) { return a === b ? window.t('line') + ' ' + a : window.t('lines') + ' ' + a + '–' + b; }

  window.registerFilePage = function (key) {
    const d = window.EX[key];
    window.PAGES[key] = {
      title: d.title,
      html: function () {
        const total = window.fileLineCount(d.src);
        const i = ORDER.indexOf(key);
        const prev = i > 0 ? ORDER[i - 1] : null, next = i < ORDER.length - 1 ? ORDER[i + 1] : null;
        let h = '<div class="hero"><div class="eyebrow">' + window.esc(d.path) + ' · ' + total + ' ' + window.t('s_lines') + '</div><h1>' + window.tx(d.title) + '</h1><p class="lead">' + window.tx(d.role) + '</p></div>';
        if (d.say) h += '<div class="note ok"><b>' + window.t('s_say') + ':</b> ' + window.tx(d.say) + '</div>';
        if (d.diff) h += '<div class="note"><b>' + window.t('s_diff') + ':</b> ' + window.tx(d.diff) + '</div>';
        h += '<h2>' + window.t('s_full') + '</h2>' + window.codeFile(d.src, 1, total, { full: true, title: d.path });
        h += '<h2>' + window.t('s_break') + '</h2><div class="toc" aria-label="' + window.t('s_blocks') + '">' +
          d.blocks.map(function (b, bi) { return '<a href="#b' + bi + '">' + window.tx(b.title) + '</a>'; }).join('') + '</div>';
        d.blocks.forEach(function (b, bi) {
          const r = range(b.lines);
          h += '<section class="block" id="b' + bi + '"><div class="block-head"><h3>' + window.tx(b.title) + '</h3><span class="range">' + lineLabel(r[0], r[1]) + '</span></div>';
          if (b.text) h += '<p>' + window.tx(b.text) + '</p>';
          (b.items || []).forEach(function (it) {
            const rr = range(it[0]);
            h += '<div class="item"><span class="range">' + lineLabel(rr[0], rr[1]) + '</span>' +
              window.codeFile(d.src, rr[0], rr[1], { title: LABEL[key] }) + '<p class="why">' + window.tx(it[1]) + '</p></div>';
          });
          if (b.q) h += '<div class="defq"><b>' + window.t('s_qa').replace(/^\d+\.\s*/, '') + ':</b> ' + window.tx(b.q) + '</div>';
          h += '</section>';
        });
        if (d.qa && d.qa.length) {
          h += '<h2>' + window.t('s_qa') + '</h2>' + d.qa.map(function (qa) {
            return '<details class="q"><summary>' + window.tx(qa[0]) + '</summary><div>' + window.tx(qa[1]) + '</div></details>';
          }).join('');
        }
        h += '<div class="file-nav">' + (prev ? '<a class="btn" href="' + PAGEFILE[prev] + '">' + window.t('prev') + ' ' + LABEL[prev] + '</a>' : '<a class="btn" href="index.html">' + window.t('prev') + ' ' + window.t('nav_home') + '</a>') +
          (next ? '<a class="btn primary" href="' + PAGEFILE[next] + '">' + LABEL[next] + ' ' + window.t('next') + '</a>' : '<a class="btn primary" href="commands.html">' + window.t('nav_commands') + ' →</a>') + '</div>';
        return h;
      }
    };
  };
  window.EX_ORDER = ORDER; window.EX_PAGEFILE = PAGEFILE; window.EX_LABEL = LABEL;
})();
