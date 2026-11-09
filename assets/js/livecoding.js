/* Live-coding page: tasks + sandbox party + automatic check against the reference solution. */
(function () {
  'use strict';
  Object.assign(UI, {
    lc_title: ['Live-coding: тренировка', 'Live-coding: жаттығу', 'Live coding practice'],
    lc_lead: ['Задачи по частям нашего проекта. Пиши код, жми «Проверить» (или Ctrl+Enter): код выполняется на живой песочнице-вечеринке и сравнивается с эталонным решением. Ответ можно посмотреть сразу или после попытки.', 'Біздің жобаның бөліктері бойынша есептер. Код жаз, «Тексеру» (немесе Ctrl+Enter) бас: код тірі құм жәшігі-кеште орындалады және эталон шешіммен салыстырылады. Жауапты бірден немесе әрекеттен кейін көруге болады.', 'Tasks based on parts of our project. Write code and press “Check” (or Ctrl+Enter): the code runs on a live sandbox party and is compared with the reference solution. You can open the answer at once or after an attempt.'],
    lc_vars: ['Доступно в коде:', 'Кодта қолжетімді:', 'Available in your code:'],
    lc_chain: ['Тип «цепочка»: напиши выражение или несколько строк с <code>return</code>, который вернёт jQuery-набор.', '«Тізбек» түрі: jQuery жиынын қайтаратын өрнек немесе <code>return</code> бар бірнеше жол жаз.', 'Type “chain”: write an expression or several lines with <code>return</code> that returns a jQuery set.'],
    lc_check: ['Проверить', 'Тексеру', 'Check'], lc_run: ['Запустить', 'Іске қосу', 'Run'], lc_reset: ['Сбросить код', 'Кодты тастау', 'Reset code'],
    lc_hint: ['Подсказка', 'Кеңес', 'Hint'], lc_sol: ['Ответ', 'Жауап', 'Answer'], lc_runsol: ['Показать на странице', 'Бетте көрсету', 'Show on the page'],
    lc_expl: ['Разбор', 'Талдау', 'Explanation'],
    lc_ok: ['Верно!', 'Дұрыс!', 'Correct!'], lc_bad: ['Пока не то.', 'Әзірге болмады.', 'Not yet.'],
    lc_err: ['Ошибка в коде', 'Кодта қате', 'Error in the code'],
    lc_found: ['Найдено', 'Табылды', 'Found'], lc_expected: ['Ожидалось', 'Күтілгені', 'Expected'], lc_got: ['У тебя', 'Сенде', 'Yours'],
    lc_missing: ['Не хватает', 'Жетіспейді', 'Missing'], lc_extra: ['Лишние', 'Артық', 'Extra'], lc_none: ['пусто', 'бос', 'empty'],
    lc_notjq: ['Код должен вернуть jQuery-набор (используй <code>return</code>).', 'Код jQuery жиынын қайтаруы керек (<code>return</code> қолдан).', 'The code must return a jQuery set (use <code>return</code>).'],
    lc_nofn: ['Функция не найдена:', 'Функция табылмады:', 'Function not found:'],
    lc_f_found: ['найденные гости/комнаты', 'табылған қонақтар/бөлмелер', 'found guests/rooms'], lc_f_order: ['порядок гостей по комнатам', 'бөлмелер бойынша қонақтар реті', 'order of guests by room'],
    lc_f_hidden: ['скрытые гости', 'жасырын қонақтар', 'hidden guests'], lc_f_faded: ['бледные карточки (имя:прозрачность)', 'бозарған карточкалар (аты:мөлдірлік)', 'pale cards (name:opacity)'],
    lc_f_marked: ['гости с классом found', 'found класы бар қонақтар', 'guests with the class found'], lc_f_tops: ['сдвинутые карточки (имя:top)', 'жылжыған карточкалар (аты:top)', 'moved cards (name:top)'],
    lc_t_test: ['Вызов', 'Шақыру', 'Call'], lc_t_got: ['Твой результат', 'Сенің нәтижең', 'Your result'], lc_t_exp: ['Эталон', 'Эталон', 'Expected'],
    lc_waiting: ['Жду окончания анимации…', 'Анимацияның аяқталуын күтемін…', 'Waiting for the animation…'],
    lc_progress: ['Решено', 'Шешілді', 'Solved'], lc_level: ['Уровень', 'Деңгей', 'Level'], lc_all: ['Все', 'Барлығы', 'All'],
    lc_sandbox: ['Песочница: вечеринка', 'Құм жәшігі: кеш', 'Sandbox: the party'], lc_rebuild: ['Перестроить (buildParty)', 'Қайта құру (buildParty)', 'Rebuild (buildParty)'],
    lc_must: ['В решении ожидается:', 'Шешімде күтілетіні:', 'The solution is expected to use:'], lc_mustnot: ['Ищи по странице, а не по массиву <code>PARTY</code> (по условию задания).', 'Массивті емес, бетті іздеу керек <code>PARTY</code> (тапсырма шарты бойынша).', 'Search the page, not the <code>PARTY</code> array (by the assignment rule).'],
    lc_t_chain: ['цепочка', 'тізбек', 'chain'], lc_t_dom: ['изменение страницы', 'бетті өзгерту', 'page change'], lc_t_fn: ['функция', 'функция', 'function'],
    lc_tip: ['Подсказка: Tab вставляет отступ, Ctrl+Enter — проверить.', 'Кеңес: Tab шегініс қояды, Ctrl+Enter — тексеру.', 'Tip: Tab inserts an indent, Ctrl+Enter checks.']
  });
  const ARGS = ['$', 'jQuery', 'buildGuest', 'buildParty', 'PARTY', 'MIRAS', 'LIVING_ROOM', 'toMinutes'];
  const FLABEL = { found: 'lc_f_found', order: 'lc_f_order', hidden: 'lc_f_hidden', faded: 'lc_f_faded', marked: 'lc_f_marked', tops: 'lc_f_tops' };
  let level = 0, doneSet = {}, codes = {}, busy = false;
  try { doneSet = JSON.parse(localStorage.getItem('lc_done') || '{}'); } catch (e) {}
  try { codes = JSON.parse(localStorage.getItem('lc_code') || '{}'); } catch (e) {}
  const saveDone = () => { try { localStorage.setItem('lc_done', JSON.stringify(doneSet)); } catch (e) {} };
  const saveCodes = () => { try { localStorage.setItem('lc_code', JSON.stringify(codes)); } catch (e) {} };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- running code ---------- */
  function compileExpr(code) {
    const body = code.trim().replace(/;\s*$/, '');
    try { return new Function(ARGS.join(','), 'return (' + body + '\n);'); } catch (e) { /* maybe statements */ }
    return new Function(ARGS.join(','), code);
  }
  function runChain(code) {
    const f = compileExpr(code);
    return f($, $, window.buildGuest, window.buildParty, PARTY, MIRAS, LIVING_ROOM, window.toMinutes);
  }
  function compileFn(code, name) {
    const f = new Function(ARGS.join(','), code + '\n;return typeof ' + name + ' === "function" ? ' + name + ' : undefined;');
    return f($, $, window.buildGuest, window.buildParty, PARTY, MIRAS, LIVING_ROOM, window.toMinutes);
  }
  const names = ($s) => $s.map(function () { return $(this).attr('data-name'); }).get();
  function signature(res, fields) {
    const s = {};
    fields.forEach(function (f) {
      if (f === 'found') s.found = res && res.jquery ? names(res).sort() : null;
      if (f === 'order') s.order = $('.guests').map(function () { return $(this).closest('.room').attr('id') + ': ' + $(this).children('.guest').map(function () { return $(this).attr('data-name'); }).get().join(', '); }).get();
      if (f === 'hidden') s.hidden = names($('.guest').filter(function () { return $(this).css('display') === 'none'; })).sort();
      if (f === 'marked') s.marked = names($('.guest.found')).sort();
      if (f === 'faded') s.faded = $('.guest .card').map(function () { const o = parseFloat($(this).css('opacity')); return o < 0.99 ? $(this).closest('.guest').attr('data-name') + ':' + o.toFixed(1) : null; }).get().sort();
      if (f === 'tops') s.tops = $('.guest .card').map(function () { const tp = Math.round(parseFloat($(this).css('top')) || 0); return tp ? $(this).closest('.guest').attr('data-name') + ':' + tp : null; }).get().sort();
    });
    return s;
  }
  async function execute(task, code) {
    window.buildParty();
    const res = runChain(code);
    if (task.wait) await sleep(task.wait);
    return signature(res, task.fields);
  }
  const diff = (a, b) => ({ missing: b.filter((x) => a.indexOf(x) < 0), extra: a.filter((x) => b.indexOf(x) < 0) });
  const list = (a) => a.length ? a.map((x) => '<code>' + esc(x) + '</code>').join(', ') : '<i>' + t('lc_none') + '</i>';

  async function check(task, code) {
    const out = { ok: false, html: '' };
    const checks = [];
    (task.must || []).forEach(function (m) { if (!new RegExp(m[0]).test(code)) checks.push(m[1]); });
    (task.mustNot || []).forEach(function (m) { if (new RegExp(m).test(code)) checks.push('!' + m); });
    const staticMsg = function () {
      let h = '';
      const must = checks.filter((c) => c[0] !== '!'), not = checks.filter((c) => c[0] === '!');
      if (must.length) h += '<div>' + t('lc_must') + ' <code>' + esc(must.join(', ')) + '</code></div>';
      if (not.length) h += '<div>' + t('lc_mustnot') + '</div>';
      return h;
    };
    try {
      if (task.type === 'fn') {
        const ref = compileFn(task.solution, task.fn), usr = compileFn(code, task.fn);
        if (!usr) { out.html = '<div class="result bad"><b>' + t('lc_bad') + '</b> ' + t('lc_nofn') + ' <code>' + task.fn + '</code></div>'; return out; }
        window.buildParty();
        let all = true, rows = '';
        task.tests.forEach(function (tc) {
          let got, exp, err = '';
          try { exp = JSON.stringify(tc.run(ref, $, JSON.parse(JSON.stringify(PARTY)))); } catch (e) { exp = 'ref error'; }
          try { got = JSON.stringify(tc.run(usr, $, JSON.parse(JSON.stringify(PARTY)))); } catch (e) { got = ''; err = String(e.message || e); }
          const pass = !err && got === exp; all = all && pass;
          rows += '<tr><td><code>' + esc(tc.label) + '</code></td><td class="' + (pass ? 'p' : 'f') + '">' + esc(err || got || 'undefined') + '</td><td>' + esc(exp) + '</td><td class="' + (pass ? 'p' : 'f') + '">' + (pass ? '✓' : '✗') + '</td></tr>';
        });
        out.ok = all && !checks.length;
        out.html = '<div class="result ' + (out.ok ? 'ok' : 'bad') + '"><b>' + (out.ok ? t('lc_ok') : t('lc_bad')) + '</b></div><div class="tscroll"><table class="tests"><tr><th>' + t('lc_t_test') + '</th><th>' + t('lc_t_got') + '</th><th>' + t('lc_t_exp') + '</th><th></th></tr>' + rows + '</table></div>';
        return out;
      }
      const exp = await execute(task, task.solution);
      const got = await execute(task, code);        // the final DOM state is the user's
      let allOk = true, det = '';
      task.fields.forEach(function (f) {
        const g = got[f], e = exp[f];
        if (g === null && f === 'found') { allOk = false; det += '<div>' + t('lc_notjq') + '</div>'; return; }
        const same = JSON.stringify(g) === JSON.stringify(e);
        allOk = allOk && same;
        if (f === 'order') {
          if (!same) det += '<div><b>' + t(FLABEL[f]) + '</b><br>' + e.map(function (line, i) { return (line === g[i] ? '✓ ' : '✗ ') + '<code>' + esc(g[i] || '') + '</code>' + (line === g[i] ? '' : ' → ' + t('lc_expected') + ' <code>' + esc(line) + '</code>'); }).join('<br>') + '</div>';
        } else if (!same) {
          const d = diff(g, e);
          det += '<div><b>' + t(FLABEL[f]) + '</b>: ' + t('lc_got') + ' (' + g.length + '): ' + list(g) + '<br>' + t('lc_expected') + ' (' + e.length + '): ' + list(e) + (d.missing.length ? '<br>' + t('lc_missing') + ': ' + list(d.missing) : '') + (d.extra.length ? '<br>' + t('lc_extra') + ': ' + list(d.extra) : '') + '</div>';
        }
      });
      out.ok = allOk && !checks.length;
      const f0 = task.fields[0], shown = got[f0];
      out.html = '<div class="result ' + (out.ok ? 'ok' : 'bad') + '"><b>' + (out.ok ? t('lc_ok') : t('lc_bad')) + '</b>' +
        (allOk && f0 === 'found' && shown ? ' ' + t('lc_found') + ' ' + shown.length + ': ' + list(shown) : '') + (det ? '<br>' + det : '') + staticMsg() + '</div>';
      if (allOk && checks.length) out.html = out.html.replace(t('lc_ok'), t('lc_bad'));
      return out;
    } catch (e) {
      out.html = '<div class="result bad"><b>' + t('lc_err') + ':</b> <code>' + esc(String(e && e.message || e)) + '</code></div>';
      return out;
    }
  }
  async function runOnly(task, code) { // just run it visibly, without comparing
    window.buildParty();
    try {
      if (task.type === 'fn') { const f = compileFn(code, task.fn); return f ? '<div class="result info">OK: <code>' + task.fn + '</code> ✓</div>' : '<div class="result bad">' + t('lc_nofn') + ' <code>' + task.fn + '</code></div>'; }
      const res = runChain(code);
      if (res && res.jquery) { res.addClass('found'); return '<div class="result info">' + t('lc_found') + ' ' + res.length + ': ' + list(names(res)) + '</div>'; }
      return '<div class="result info">OK</div>';
    } catch (e) { return '<div class="result bad"><b>' + t('lc_err') + ':</b> <code>' + esc(String(e.message || e)) + '</code></div>'; }
  }

  /* ---------- page ---------- */
  function taskHtml(task, n) {
    const title = tx(task.title), done = doneSet[task.id];
    return '<article class="task' + (done ? ' done' : '') + '" id="t-' + task.id + '" data-id="' + task.id + '">' +
      '<div class="task-head"><h3>' + n + '. ' + esc(title) + '</h3><span class="pill">' + t('lc_level') + ' ' + task.lvl + '</span><span class="pill">' + t('lc_t_' + (task.type === 'fn' ? 'fn' : task.type)) + '</span>' + (done ? '<span class="pill ok">✓</span>' : '') + '</div>' +
      '<p>' + tx(task.desc) + '</p>' +
      '<textarea class="editor" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="code" rows="' + Math.max(5, (codes[task.id] || task.starter).split('\n').length + 1) + '">' + esc(codes[task.id] != null ? codes[task.id] : task.starter) + '</textarea>' +
      '<div class="actions"><button type="button" class="btn primary small" data-a="check">' + t('lc_check') + '</button>' +
      (task.type === 'fn' ? '' : '<button type="button" class="btn small" data-a="run">' + t('lc_run') + '</button>') +
      '<button type="button" class="btn small" data-a="hint">' + t('lc_hint') + '</button><button type="button" class="btn small" data-a="sol">' + t('lc_sol') + '</button><button type="button" class="btn small" data-a="reset">' + t('lc_reset') + '</button></div>' +
      '<div class="out"></div><div class="hintbox" hidden><div class="note">' + tx(task.hint) + '</div></div>' +
      '<div class="solbox" hidden>' + codeSnippet(task.solution, 'js', t('lc_sol')) + '<div class="note ok"><b>' + t('lc_expl') + ':</b> ' + tx(task.why) + '</div>' +
      (task.type === 'fn' ? '' : '<button type="button" class="btn small" data-a="runsol">' + t('lc_runsol') + '</button>') + '</div></article>';
  }
  function listHtml() {
    let n = 0;
    return window.TASKS.filter((x) => !level || x.lvl === level).map((x) => taskHtml(x, ++n)).join('');
  }
  function progress() {
    const total = window.TASKS.length, d = window.TASKS.filter((x) => doneSet[x.id]).length;
    return '<div class="panel"><b>' + t('lc_progress') + ': ' + d + ' / ' + total + '</b><div class="progress" role="progressbar" aria-valuenow="' + d + '" aria-valuemax="' + total + '"><i style="width:' + Math.round(d / total * 100) + '%"></i></div></div>';
  }

  window.PAGES.live = {
    title: UI.nav_live,
    html: function () {
      return '<div class="hero"><div class="eyebrow">25 / 50</div><h1>' + t('lc_title') + '</h1><p class="lead">' + t('lc_lead') + '</p></div>' + progress() +
        '<p class="muted">' + t('lc_vars') + ' <code>$</code> <code>buildGuest</code> <code>buildParty</code> <code>PARTY</code> <code>MIRAS</code> <code>LIVING_ROOM</code> <code>toMinutes</code> · ' + t('lc_tip') + '</p>' +
        '<div class="chips" role="group">' + [0, 1, 2, 3].map((l) => '<button type="button" class="chip" data-lvl="' + l + '" aria-pressed="' + (l === level) + '">' + (l ? t('lc_level') + ' ' + l : t('lc_all')) + '</button>').join('') + '</div>' +
        '<div class="lc"><div id="tasks">' + listHtml() + '</div><aside class="sticky-sb"><div class="sb-title"><b>' + t('lc_sandbox') + '</b><button type="button" class="btn small" id="sb-rebuild">' + t('lc_rebuild') + '</button></div>' +
        '<div id="sandbox"><div id="floors" class="floors"></div></div></aside></div>';
    },
    init: function (app) {
      window.buildParty();
      app.querySelector('#sb-rebuild').addEventListener('click', function () { window.buildParty(); });
      app.querySelectorAll('[data-lvl]').forEach(function (b) { b.addEventListener('click', function () { level = +b.getAttribute('data-lvl'); window.rerender(); }); });
      const root = app.querySelector('#tasks');
      root.addEventListener('input', function (e) { const a = e.target.closest('.task'); if (a && e.target.matches('.editor')) { codes[a.dataset.id] = e.target.value; saveCodes(); } });
      root.addEventListener('keydown', function (e) {
        if (!e.target.matches('.editor')) return;
        if (e.key === 'Tab') { e.preventDefault(); const s = e.target.selectionStart; e.target.setRangeText('  ', s, e.target.selectionEnd, 'end'); e.target.dispatchEvent(new Event('input', { bubbles: true })); }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); e.target.closest('.task').querySelector('[data-a="check"]').click(); }
      });
      root.addEventListener('click', async function (e) {
        const btn = e.target.closest('[data-a]'); if (!btn) return;
        const art = btn.closest('.task'), task = window.TASKS.find((x) => x.id === art.dataset.id), ed = art.querySelector('.editor'), out = art.querySelector('.out');
        const act = btn.dataset.a;
        if (act === 'hint') art.querySelector('.hintbox').hidden = !art.querySelector('.hintbox').hidden;
        else if (act === 'sol') art.querySelector('.solbox').hidden = !art.querySelector('.solbox').hidden;
        else if (act === 'reset') { ed.value = task.starter; codes[task.id] = task.starter; saveCodes(); out.innerHTML = ''; }
        else if (act === 'run') { out.innerHTML = await runOnly(task, ed.value); }
        else if (act === 'runsol') { out.innerHTML = await runOnly(task, task.solution); }
        else if (act === 'check') {
          if (busy) return; busy = true; out.innerHTML = '<div class="result info">' + t('lc_waiting') + '</div>';
          try {
            const r = await check(task, ed.value); out.innerHTML = r.html;
            if (r.ok && !doneSet[task.id]) { doneSet[task.id] = 1; saveDone(); art.classList.add('done'); art.querySelector('.task-head').insertAdjacentHTML('beforeend', '<span class="pill ok">✓</span>'); const p = document.querySelector('.progress'); if (p) { const d = window.TASKS.filter((x) => doneSet[x.id]).length; p.firstChild.style.width = Math.round(d / window.TASKS.length * 100) + '%'; p.parentNode.firstChild.textContent = t('lc_progress') + ': ' + d + ' / ' + window.TASKS.length; } }
          } finally { busy = false; }
        }
      });
    }
  };
})();
