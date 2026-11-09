# jQuery Defense — Assignment 6 (Selector Detective + The party in motion)

Статический сайт для подготовки к защите: разбор задания, подробный разбор каждого файла проекта (полный код → блоки → построчно), справочник всех команд, страница live-coding с автопроверкой и вопросы на защите. Языки: **қазақша / русский / English** (переключатель вверху, выбор запоминается).

A static website to prepare for the defense: assignment overview, a breakdown of every project file (full code → blocks → line by line), a reference of every command, a live-coding page with automatic checking, and defense Q&A. Languages: Kazakh / Russian / English.

## Страницы / Pages

| Файл | Что внутри |
|---|---|
| `index.html` | О задании, баллы, правила, Task 1 и Task 2, 20 кейсов, структура, чек-лист |
| `file-data.html` … `file-html.html` | Разборы `data.js`, `render.js`, `cases.js`, `app.js`, `effects.js`, `style.css`, `index.html` |
| `commands.html` | Каждая команда jQuery/JS: что делает, зачем, где в проекте |
| `livecoding.html` | 32 задачи, песочница-вечеринка, проверка по эталону, ответы |
| `qa.html` | Вопросы на защите и типичные live-coding задачи |
| `project/` | Сам проект (task1, task2) — открывается прямо с сайта |

## Запуск локально

Сайт не требует сборки и сервера. Но браузеры иногда ограничивают `localStorage` для `file://`, поэтому лучше так:

```bash
cd defense-site
python3 -m http.server 8000
# открыть http://localhost:8000
```

(Можно и просто открыть `index.html` двойным кликом — всё, кроме сохранения прогресса, работает.)

## Публикация на GitHub Pages

**Вариант 1 (проще всего)**

1. Создай репозиторий на GitHub и загрузи в него *содержимое* папки `defense-site` (чтобы `index.html` лежал в корне репозитория):
   ```bash
   cd defense-site
   git init
   git add .
   git commit -m "jQuery defense site"
   git branch -M main
   git remote add origin https://github.com/<USER>/<REPO>.git
   git push -u origin main
   ```
2. На GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
3. Через 1–2 минуты сайт откроется по адресу `https://<USER>.github.io/<REPO>/`.

**Вариант 2 (GitHub Actions)** — в репозитории уже есть `.github/workflows/pages.yml`. В **Settings → Pages → Source** выбери **GitHub Actions**; после каждого push в `main` сайт задеплоится сам.

Все пути в сайте относительные, поэтому он работает и в подпапке (`/<REPO>/`). Файл `.nojekyll` отключает обработку Jekyll.

## Как изменить код проекта и обновить разборы

Разборы берут код **напрямую из `project/`** через `assets/js/sources.js`. Если ты поменял файлы проекта:

```bash
python3 tools/build.py          # пересобирает sources.js и sandbox/
node tools/check_coverage.js    # (необязательно) показывает строки без пояснений
```

Но номера строк в разборах (`assets/js/ex-*.js`) привязаны к текущему коду, поэтому после правки проекта их нужно сдвинуть вручную.

## Структура

```
index.html, file-*.html, commands.html, livecoding.html, qa.html   страницы
assets/css/site.css                                                  оформление
assets/js/core.js        язык, тема, навигация, подсветка кода
assets/js/explain.js     шаблон страницы файла
assets/js/ex-*.js        разборы файлов (RU / KK / EN)
assets/js/home.js, commands.js, qa.js, tasks.js, livecoding.js
assets/js/sources.js     исходники проекта (генерируется tools/build.py)
sandbox/                 данные и render.js Task 1 + sandbox.css для live-coding
lib/jquery-3.7.1.min.js  jQuery
project/                 исходный проект jquery-detective
tools/                   build.py, check_coverage.js, assignment.txt
```

## Как добавить язык или исправить перевод

Каждый текст — массив `[русский, қазақша, English]`. Найди его в `assets/js/*.js` и поправь нужный элемент.
