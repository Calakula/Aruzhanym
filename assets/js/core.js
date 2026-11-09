/* Core: language (ru / kk / en), theme, navigation, syntax highlighting, code blocks. Vanilla JS only. */
(function () {
  'use strict';
  const LANGS = ['ru', 'kk', 'en'];
  window.UI = window.UI || {};
  Object.assign(window.UI, {
    brand: ['jQuery · Защита', 'jQuery · Қорғау', 'jQuery · Defense'],
    nav_home: ['Главная', 'Басты бет', 'Home'],
    nav_commands: ['Команды', 'Командалар', 'Commands'],
    nav_live: ['Live-coding', 'Live-coding', 'Live coding'],
    nav_qa: ['Вопросы', 'Сұрақтар', 'Q&A'],
    copy: ['Копировать', 'Көшіру', 'Copy'], copied: ['Скопировано', 'Көшірілді', 'Copied'],
    expand: ['Развернуть', 'Ашу', 'Expand'], collapse: ['Свернуть', 'Жинау', 'Collapse'],
    line: ['строка', 'жол', 'line'], lines: ['строки', 'жолдар', 'lines'],
    prev: ['← Назад', '← Артқа', '← Back'], next: ['Дальше →', 'Әрі қарай →', 'Next →'],
    foot: ['Assignment 6 · jQuery · Astana IT University · Web Technologies', 'Assignment 6 · jQuery · Astana IT University · Web Technologies', 'Assignment 6 · jQuery · Astana IT University · Web Technologies'],
    theme: ['Тема', 'Тақырып', 'Theme']
  });

  /* ---------- language ---------- */
  let lang = 'ru';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    const saved = localStorage.getItem('lang');
    if (LANGS.includes(q)) lang = q;
    else if (LANGS.includes(saved)) lang = saved;
    else { const n = (navigator.language || 'ru').slice(0, 2); lang = n === 'kk' ? 'kk' : n === 'en' ? 'en' : 'ru'; }
  } catch (e) {}
  const li = () => LANGS.indexOf(lang);
  window.getLang = () => lang;
  window.tx = (a) => Array.isArray(a) ? (a[li()] != null && a[li()] !== '' ? a[li()] : a[0]) : a;
  window.t = (k) => window.UI[k] ? window.tx(window.UI[k]) : k;
  window.esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------- highlighting ---------- */
  const JS_KW = 'const|let|var|function|return|if|else|for|while|new|this|true|false|null|undefined|typeof|in|of|delete|break|continue|switch|case|default|try|catch|throw|async|await|class';
  const JS_RE = new RegExp('(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)|(\'(?:\\\\.|[^\'\\\\\\n])*\'|"(?:\\\\.|[^"\\\\\\n])*"|`(?:\\\\.|[^`\\\\])*`)|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b(?:' + JS_KW + ')\\b)|(\\.?[A-Za-z_$][\\w$]*)(?=\\s*\\()|(\\$)', 'g');
  const CSS_RE = /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(@[a-z-]+)|(--[\w-]+|(?<=[{;\s])[a-z-]+(?=\s*:\s))|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|em|rem|%|s|ms|deg|fr|vh|vw)?\b)|(\.[A-Za-z][\w-]*)/g;
  const HTML_RE = /(<!--[\s\S]*?-->)|("[^"]*"|'[^']*')|(<\/?[A-Za-z][\w-]*|\/?>)|([A-Za-z_:][\w:.-]*)(?==)/g;

  function wrap(cls, text) { // never let a span cross a newline
    return text.split('\n').map(function (p) { return p ? '<span class="tk-' + cls + '">' + window.esc(p) + '</span>' : ''; }).join('\n');
  }
  function highlightText(src, lang) {
    const re = lang === 'css' ? CSS_RE : lang === 'html' ? HTML_RE : JS_RE;
    re.lastIndex = 0;
    let out = '', last = 0, m;
    while ((m = re.exec(src))) {
      if (m.index > last) out += window.esc(src.slice(last, m.index));
      let cls = null, txt = m[0];
      if (lang === 'js') {
        if (m[1]) cls = 'com'; else if (m[2]) cls = 'str'; else if (m[3]) cls = 'num'; else if (m[4]) cls = 'kw';
        else if (m[5]) {
          if (txt[0] === '.') { out += '.'; txt = txt.slice(1); cls = 'jq'; } else cls = 'fn';
        } else if (m[6]) cls = 'jq';
      } else if (lang === 'css') {
        if (m[1]) cls = 'com'; else if (m[2]) cls = 'str'; else if (m[3]) cls = 'kw'; else if (m[4]) cls = 'prop'; else if (m[5]) cls = 'num'; else if (m[6]) cls = 'fn';
      } else {
        if (m[1]) cls = 'com'; else if (m[2]) cls = 'str'; else if (m[3]) cls = 'tag'; else if (m[4]) cls = 'attr';
      }
      out += cls ? wrap(cls, txt) : window.esc(txt);
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    out += window.esc(src.slice(last));
    return out.split('\n');
  }
  window.highlightText = highlightText;

  const FILE_LANG = { 'data.js': 'js', 'render.js': 'js', 'cases.js': 'js', 'app.js': 'js', 'effects.js': 'js', 'style.css': 'css', 'index.html': 'html' };
  const HLCACHE = {};
  function fileLines(name) {
    if (!HLCACHE[name]) {
      const raw = (window.SRC[name] || '').split('\n');
      HLCACHE[name] = { raw: raw, html: highlightText(window.SRC[name] || '', FILE_LANG[name] || 'js') };
    }
    return HLCACHE[name];
  }

  /* ---------- code blocks ---------- */
  let COPY = [];
  window.resetCopy = () => { COPY = []; };
  // lines: array of highlighted html lines; raw: text for the copy button
  function codeHtml(opts) {
    const idx = COPY.push(opts.raw) - 1;
    const body = opts.html.map(function (h, i) {
      const n = opts.start + i;
      return '<span class="ln' + (opts.hl && opts.hl.indexOf(n) >= 0 ? ' hl' : '') + '" data-n="' + n + '">' + h + '</span>';
    }).join('');
    return '<div class="code' + (opts.full ? ' full' : '') + '"><div class="code-bar"><span>' + window.esc(opts.title || '') + '</span><span>' +
      (opts.full ? '<button type="button" data-expand>' + window.t('expand') + '</button> ' : '') +
      '<button type="button" data-ci="' + idx + '">' + window.t('copy') + '</button></span></div><pre><code>' + body + '</code></pre></div>';
  }
  window.codeSnippet = function (code, lang, title) { // free snippet (not from SRC)
    const raw = code.replace(/^\n+|\s+$/g, '');
    return codeHtml({ html: highlightText(raw, lang || 'js'), raw: raw, start: 1, title: title || '' });
  };
  window.codeFile = function (name, from, to, opts) { // exact lines of a real project file
    const f = fileLines(name);
    from = from || 1; to = to || f.raw.length;
    opts = opts || {};
    return codeHtml({ html: f.html.slice(from - 1, to), raw: f.raw.slice(from - 1, to).join('\n'), start: from, title: opts.title || name, full: opts.full, hl: opts.hl });
  };
  window.fileLineCount = (name) => fileLines(name).raw.length;

  /* ---------- navigation ---------- */
  const NAV = [
    ['index.html', 'home', 'nav_home'],
    ['file-data.html', 'data', 'data.js'], ['file-render.html', 'render', 'render.js'], ['file-cases.html', 'cases', 'cases.js'],
    ['file-app.html', 'app', 'app.js'], ['file-effects.html', 'effects', 'effects.js'], ['file-css.html', 'css', 'style.css'], ['file-html.html', 'html', 'index.html'],
    ['commands.html', 'commands', 'nav_commands'], ['livecoding.html', 'live', 'nav_live'], ['qa.html', 'qa', 'nav_qa']
  ];
  window.NAV = NAV;
  function navHtml(page) {
    const items = NAV.map(function (n, i) {
      const label = n[2].indexOf('nav_') === 0 ? window.t(n[2]) : n[2];
      const sep = (i === 1 || i === 8) ? '<span class="sep"></span>' : '';
      return sep + '<a href="' + n[0] + '"' + (n[1] === page ? ' class="on" aria-current="page"' : '') + '>' + window.esc(label) + '</a>';
    }).join('');
    const langBtns = LANGS.map(function (l) {
      return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === lang) + '">' + { ru: 'РУС', kk: 'ҚАЗ', en: 'ENG' }[l] + '</button>';
    }).join('');
    return '<div class="nav-in"><a class="brand" href="index.html"><i>$</i><span>' + window.t('brand') + '</span></a><nav class="menu" aria-label="Pages">' + items + '</nav>' +
      '<div class="tools"><div class="lang" role="group" aria-label="Language">' + langBtns + '</div><button type="button" class="icon-btn" id="theme-btn" title="' + window.t('theme') + '" aria-label="' + window.t('theme') + '">◐</button></div></div>';
  }

  /* ---------- page lifecycle ---------- */
  window.PAGES = {};
  function render() {
    const page = document.body.dataset.page;
    const def = window.PAGES[page];
    const nav = document.getElementById('nav');
    nav.className = 'nav'; nav.innerHTML = navHtml(page);
    const menu = nav.querySelector('.menu'), on = menu.querySelector('a.on'); if (on && window.innerWidth < 1000) { menu.scrollLeft = Math.max(0, on.offsetLeft - menu.offsetLeft - 80); }
    document.documentElement.lang = lang;
    const app = document.getElementById('app');
    window.resetCopy();
    if (def) {
      if (def.before) def.before(app);
      app.innerHTML = def.html();
      document.title = window.tx(def.title) + ' — jQuery Defense';
      if (def.init) def.init(app);
    }
    const foot = document.getElementById('foot'); if (foot) foot.textContent = window.t('foot');
  }
  window.rerender = render;

  document.addEventListener('click', function (e) {
    const lb = e.target.closest('[data-lang]');
    if (lb) { lang = lb.getAttribute('data-lang'); try { localStorage.setItem('lang', lang); } catch (x) {} render(); return; }
    if (e.target.closest('#theme-btn')) {
      const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const nx = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nx);
      try { localStorage.setItem('theme', nx); } catch (x) {}
      return;
    }
    const cb = e.target.closest('[data-ci]');
    if (cb) {
      const txt = COPY[+cb.getAttribute('data-ci')], old = cb.textContent;
      const done = function () { cb.textContent = window.t('copied'); setTimeout(function () { cb.textContent = old; }, 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, done);
      else { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (x) {} ta.remove(); done(); }
      return;
    }
    const ex = e.target.closest('[data-expand]');
    if (ex) {
      const box = ex.closest('.code'); const open = box.classList.toggle('full');
      ex.textContent = open ? window.t('expand') : window.t('collapse');
      box.querySelector('pre').style.maxHeight = open ? '' : 'none';
    }
  });

  try { const th = localStorage.getItem('theme'); if (th) document.documentElement.setAttribute('data-theme', th); } catch (e) {}
  window.addEventListener('DOMContentLoaded', render);
})();
