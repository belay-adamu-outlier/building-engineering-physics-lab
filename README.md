# Building Engineering Physics Lab

Public site for Professor Fitsum Tariku's group at
Simon Fraser University.

## Run

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npm install
npm test
npm run dev
```

`NODE_OPTIONS` is needed on this machine so npm can
verify the registry certificate.

Open http://localhost:5173. The API runs on port 4000.

Contact messages are saved in `server/data/messages.json`.
They are not emailed.

## Edit content

Change `server/data/content.json`, then refresh the browser.

## GitHub Pages

Pushes to `main` publish the client as a static page.
That build has no API, so the contact form opens an
email instead of saving a message. The local site
still uses the server.
