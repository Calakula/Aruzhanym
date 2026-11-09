#!/usr/bin/env python3
"""Regenerates assets/js/sources.js and the sandbox/ files from project/.
Run from the site root:  python3 tools/build.py
"""
import json, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
proj = root / 'project'
files = {
  'data.js':    'task2/js/data.js',
  'render.js':  'task2/js/render.js',
  'cases.js':   'task2/js/cases.js',
  'app.js':     'task2/js/app.js',
  'effects.js': 'task2/js/effects.js',
  'style.css':  'task2/css/style.css',
  'index.html': 'task2/index.html',
}
src = {k: (proj / v).read_text(encoding='utf-8').rstrip('\n') for k, v in files.items()}
(root / 'assets/js/sources.js').write_text('window.SRC = ' + json.dumps(src, ensure_ascii=False, indent=1) + ';\n', encoding='utf-8')

# sandbox for the live-coding page: Task 1 data + render, avatars from project/task1/avatars
sb = root / 'sandbox'
sb.mkdir(exist_ok=True)
(sb / 'data.js').write_text((proj / 'task1/js/data.js').read_text(encoding='utf-8'), encoding='utf-8')
r = (proj / 'task1/js/render.js').read_text(encoding='utf-8').replace("'avatars/'", "'project/task1/avatars/'")
(sb / 'render.js').write_text(r, encoding='utf-8')

# sandbox.css = Task 1 style.css with every selector prefixed by #sandbox
css = (proj / 'task1/css/style.css').read_text(encoding='utf-8')
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
css = re.sub(r'@media[^{]*\{', '', css)           # drop the media query wrapper (page is narrow anyway)
out = []
for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
    sels, body = m.group(1).strip(), m.group(2).strip()
    new = []
    for s in sels.split(','):
        s = s.strip()
        if s in ('html', 'body', '*', 'html, body'):
            if s == '*': new.append('#sandbox *')
            continue
        new.append('#sandbox' if s == ':root' else '#sandbox ' + s)
    if new: out.append(', '.join(new) + ' { ' + body + ' }')
(sb / 'sandbox.css').write_text('\n'.join(out) + '\n', encoding='utf-8')
print('ok', {k: len(v) for k, v in src.items()})
