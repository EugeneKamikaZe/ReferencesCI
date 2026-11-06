# 1Ci Account References

Интерактивные HTML/CSS/JavaScript-референсы личного кабинета 1Ci. Сборка и установка зависимостей не нужны.

## GitHub Pages

Адрес сайта после публикации: **https://EugeneKamikaZe.github.io/ReferencesCI/**.

1. Добавьте изменения в коммит и отправьте их в основную ветку репозитория `EugeneKamikaZe/ReferencesCI` (локальная ветка сейчас — `master`).
2. В репозитории откройте **Settings → Pages → Build and deployment → Source** и выберите **GitHub Actions**.
3. Откройте **Actions → Deploy GitHub Pages → Run workflow**, выберите основную ветку и запустите публикацию. Если Pages включены до первого push, workflow запустится автоматически.
4. Дождитесь успешного завершения workflow. Ссылка на сайт появится в **Settings → Pages** и окружении **github-pages**.

Каждый следующий push в основную ветку автоматически обновляет сайт. Workflow использует настройку default branch репозитория, поэтому переименование `master` в `main` не требует правок. Ручной запуск также публикует только основную ветку. Секреты и отдельная ветка `gh-pages` не нужны.

[Workflow](.github/workflows/pages.yml) копирует HTML, CSS, JavaScript и `assets/` из `1ci-account-references/` в корень сайта. `index.html` открывается сразу по адресу репозитория, без дополнительного пути `/1ci-account-references/`. Документация и настройки IDE в пакет публикации не входят. Для статической публикации workflow добавляет `.nojekyll`.

Кнопка **Open SPA** открывает отдельно настроенный адрес приложения. Для публичного приложения укажите его HTTPS-адрес в панели; GitHub Pages размещает сами референсы.

## Локальный запуск

Из корня репозитория:

```bash
python3 -m http.server 8090 --directory 1ci-account-references
```

Откройте http://localhost:8090/.

Описание референсов: [REFERENCES.md](1ci-account-references/REFERENCES.md). История и текущие задачи: [TODO.md](1ci-account-references/TODO.md).
