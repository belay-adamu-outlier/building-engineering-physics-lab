import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { getSection } from './content.js';
import { saveMessage } from './storeMessage.js';
import { createLimiter, validateContact } from './validateContact.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const messageFile = path.join(here, '..', 'data', 'messages.json');
const allowContact = createLimiter(5, 10 * 60 * 1000);
const sections = ['profile', 'research', 'publications', 'news'];

/**
 * Build the Express app. Separated so tests can call it later.
 * @returns {import('express').Express}
 */
export function createApp() {
  const app = express();
  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use(express.json({ limit: '32kb' }));

  sections.forEach((name) => {
    app.get('/api/' + name, (req, res) => {
      res.json(getSection(name));
    });
  });

  app.post('/api/contact', async (req, res) => {
    const key = req.ip || 'local';
    if (!allowContact(key)) {
      res.status(429).json({
        ok: false,
        errors: { form: 'Too many messages. Try again later.' },
      });
      return;
    }

    const result = validateContact(req.body);
    if (!result.ok) {
      res.status(400).json({ ok: false, errors: result.errors });
      return;
    }

    try {
      await saveMessage(result.value, messageFile);
      res.status(201).json({ ok: true });
    } catch {
      res.status(500).json({
        ok: false,
        errors: { form: 'The message could not be saved.' },
      });
    }
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}

const isMain = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const port = Number(process.env.PORT) || 4000;
  createApp().listen(port, () => {
    process.stdout.write('API listening on ' + port + '\n');
  });
}
