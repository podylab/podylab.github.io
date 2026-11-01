# Publishes the Pody Lab site to https://podylab.github.io from the podylab
# GitHub account (log in first: gh auth login), then switches back to Zametki1Cnika.
# Run it again after changes: it commits and pushes what changed.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# pages come from build.py (templates/ + i18n/): they carry the content marks of style.css and site.js
python build.py
if ($LASTEXITCODE) { throw "pages were not built" }

gh auth switch --hostname github.com --user podylab
if ($LASTEXITCODE) { throw "Войдите в аккаунт podylab: gh auth login" }
try {
  if (-not (Test-Path .git)) {
    git init -q -b main
    git config user.name "Pody Lab"
    git config user.email podylab@gmail.com
  }
  # every language but Russian lives in its own folder, listed in i18n/langs.json
  $langs = (Get-Content i18n/langs.json -Raw -Encoding UTF8 | ConvertFrom-Json) | ForEach-Object { $_[1].TrimEnd("/") } | Where-Object { $_ -and (Test-Path $_) }
  git add index.html podee.html podoo.html support.html privacy.html guides.html fixes.html report.html podoo-guides.html podoo-fixes.html podoo-privacy.html $langs style.css site.js pody.js podoo.css podoo.js podoo-land.tpl kaspi-qr.png media build.py templates i18n preview
  git diff --cached --quiet
  if ($LASTEXITCODE) { git commit -q -m "Pody Lab site: update" }
  # (git writes to stderr when there's no remote; PowerShell would stop on that)
  if (-not ((git remote) -contains "origin")) {
    gh repo create podylab/podylab.github.io --public --description "Сайт Pody Lab: PoDee, PoDoo и поддержка" --source . --push
  } else {
    # a deploy stuck in GitHub's queue would hold the new one back
    foreach ($id in (gh run list -R podylab/podylab.github.io --status queued --json databaseId --jq ".[].databaseId")) {
      gh run cancel $id -R podylab/podylab.github.io | Out-Null
    }
    gh auth setup-git
    git push -q origin main
  }
  Write-Host "Готово. Сайт появится через 1-2 минуты: https://podylab.github.io"
} finally {
  gh auth switch --hostname github.com --user Zametki1Cnika | Out-Null
}
