# Sito web IVU Plus (`docs/site`)

Sorgente statica del sito pubblicato su **GitHub Pages** → [ivuplus.leogranata.it](https://ivuplus.leogranata.it).

| Percorso | Contenuto |
|----------|-----------|
| `index.html` | Home IT + pagine legali (routing hash) |
| `en/index.html` | Home EN leggera |
| `style.css` | Stili condivisi |
| `reveal.js` | Fade-in al scroll (rispetta `prefers-reduced-motion`) |
| `assets/` | Badge store, sorgenti immagini |
| `.nojekyll` | Disabilita Jekyll su GitHub Pages |

**Repo di deploy**: [Leottantuno/IVUPlus-site](https://github.com/Leottantuno/IVUPlus-site) (branch `main`).

## Comandi

```bash
# Ottimizza logo, favicon, banner, og-image
make optimize-site-images

# Sincronizza docs/site → IVUPlus-site (preserva CNAME e version.json)
YES=1 PUSH=1 make deploy-site MESSAGE='feat(site): ...'

# Aggiorna version.json nel repo Pages da pubspec.yaml
make sync-version-manifest
# opzionale: MIN_REQUIRED=1.14.0 IVUPLUS_SITE_REPO=~/path/to/IVUPlus-site
```

Script diretti: `scripts/site/optimize-images.sh`, `scripts/site/deploy-site.sh`.

## Deploy

1. Modifica file in `docs/site/`.
2. Incrementa il query param CSS/JS (`style.css?v=…`, `reveal.js?v=…`) se cambi stili o script.
3. `YES=1 PUSH=1 make deploy-site` — rsync con `--delete`, backup di file solo nel repo Pages.

File **non** presenti in `docs/site` ma preservati nel repo Pages:

| File | Ruolo |
|------|--------|
| `CNAME` | Dominio custom `ivuplus.leogranata.it` |
| `version.json` | Manifest controllo aggiornamenti in-app |

## `version.json`

URL pubblico: **https://ivuplus.leogranata.it/version.json**

L’app Flutter legge questo JSON (max 1 volta / 24 h) per invitare ad aggiornare dallo store. Non va committato in `docs/site`: vive solo nel repo **IVUPlus-site** e viene preservato ad ogni deploy.

### Schema

```json
{
  "latest": "1.16.3",
  "min_required": "1.0.0",
  "android_url": "https://play.google.com/store/apps/details?id=com.leogranata.ivuplus",
  "ios_url": "https://apps.apple.com/app/id6758614108",
  "check_enabled": {
    "android": true,
    "ios": false
  }
}
```

| Campo | Significato |
|-------|-------------|
| `latest` | Ultima versione sugli store (semver) |
| `min_required` | Sotto questa soglia l’aggiornamento è obbligatorio |
| `android_url` / `ios_url` | Link agli store |
| `check_enabled.android` | Controllo attivo su Android |
| `check_enabled.ios` | `false` finché iOS non è in production store; poi `true` |

### Dopo ogni release store

```bash
make sync-version-manifest
cd ../IVUPlus-site && git add version.json && git commit -m "chore(site): aggiorna version.json" && git push
```

Oppure generazione manuale:

```bash
./scripts/versioning/generate_version_manifest.sh 1.0.0 ../IVUPlus-site/version.json
```

Il primo argomento è `min_required` (default `1.0.0`); `latest` viene letto da `pubspec.yaml`.

Documentazione completa (comportamento app, dialog obbligatorio/opzionale, go-live iOS):

→ **[docs/deployment/store-version-manifest.md](../deployment/store-version-manifest.md)**

Template: [docs/deployment/version.json.example](../deployment/version.json.example)

Codice app: `lib/features/app_update/`.

## Cache browser

Dopo modifiche a CSS/JS, incrementare `?v=YYYYMMDD` su `style.css` e `reveal.js` in `index.html` e `en/index.html`.

## Animazioni

`reveal.js` applica fade-in leggero a sezioni, feature card e passi «Come funziona». Con `prefers-reduced-motion: reduce` le animazioni sono disattivate.
