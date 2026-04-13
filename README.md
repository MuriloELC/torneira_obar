# Beer Tap Display (MVP)

MVP estatico para tela vertical de torneira de cerveja usando apenas HTML, CSS, JavaScript e JSON.

## Estrutura

```text
beer-tap-display/
  index.html
  tap.html
  taps.json
  README.md
  assets/
    css/styles.css
    js/app.js
    images/
      session-ipa.jpg
      stout.jpg
      pilsen.jpg
      placeholder.jpg
```

## Como usar localmente

1. Abra a pasta `beer-tap-display`.
2. Sirva os arquivos com um servidor estatico simples (necessario para `fetch` do JSON).
3. Acesse:
   - `index.html` para visao geral
   - `tap.html?id=1` para a torneira especifica

Exemplo com Node:

```bash
npx serve .
```

## Como atualizar o conteudo

1. Edite `taps.json` e troque os dados das torneiras.
2. Substitua as imagens em `assets/images`.
3. Publique no GitHub Pages.

## Deploy no GitHub Pages

Com o repositorio publicado, a URL esperada fica neste formato:

```text
https://usuario.github.io/beer-tap-display/tap.html?id=1
```

## Raspberry Pi (kiosk)

```bash
chromium-browser --kiosk https://usuario.github.io/beer-tap-display/tap.html?id=1
```

## Requisitos atendidos

- Sem backend
- Sem framework
- Dados via JSON
- Layout mobile-first vertical
- Fallback de imagem com `placeholder.jpg`
- Tratamento de erros basico para ID e carregamento de dados
