#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'backend', 'template', 'src');
const ENV = resolve(ROOT, 'backend', '.env');

// ─── Parse .env ─────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync(ENV, 'utf-8').split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
    .map(([k, ...v]) => [k, v.join('=')])
);

const API = env.PUBLIC_URL || `http://localhost:${env.DIRECTUS_PORT || 8055}`;

// ─── HTTP helpers ────────────────────────────────────────
const get = async (path, token) => {
  const r = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) return r.status === 404 ? null : null;
  return (await r.json()).data;
};

const save = (file, data) => {
  const f = resolve(SRC, file);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, JSON.stringify(data, null, 2) + '\n');
  console.log(`  OK  ${file}`);
};

const skip = (file) => console.log(`  --  ${file} (not found)`);

// ─── Main ────────────────────────────────────────────────
async function main() {
  // Login
  console.log('Logging in...');
  const login = await get('/auth/login', '') || await (async () => {
    const r = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
    });
    if (!r.ok) throw new Error(`Login failed (${r.status})`);
    return (await r.json()).data;
  })();
  const token = login.access_token;
  console.log('OK\n');

  // 1. System collections
  const system = [
    ['collections.json', '/collections'],
    ['fields.json', '/fields'],
    ['relations.json', '/relations'],
    ['permissions.json', '/permissions'],
    ['roles.json', '/roles'],
    ['policies.json', '/policies'],
    ['access.json', '/access'],
    ['presets.json', '/presets'],
    ['flows.json', '/flows'],
    ['operations.json', '/operations'],
    ['folders.json', '/folders'],
    ['files.json', '/files'],
    ['dashboards.json', '/dashboards'],
    ['panels.json', '/panels'],
    ['translations.json', '/translations'],
    ['extensions.json', '/extensions'],
    ['settings.json', '/settings'],
  ];
  console.log('--- System ---');
  for (const [file, ep] of system) {
    const d = await get(ep, token);
    d ? save(file, d) : skip(file);
  }

  // Users (mask passwords)
  console.log('\n--- Users ---');
  const users = await get('/users', token);
  if (users) { users.forEach(u => { u.password = null; }); save('users.json', users); }
  else skip('users.json');

  // 2. Content collections
  const content = [
    'pages', 'posts', 'redirects', 'navigation', 'navigation_items',
    'globals', 'forms', 'form_fields', 'form_submissions', 'form_submission_values',
    'block_hero', 'block_richtext', 'block_gallery', 'block_gallery_items',
    'block_pricing', 'block_pricing_cards', 'block_posts', 'block_form',
    'block_button', 'block_button_group', 'page_blocks', 'ai_prompts',
  ];
  console.log('\n--- Content ---');
  for (const c of content) {
    const d = await get(`/items/${c}`, token);
    d ? save(`content/${c}.json`, d) : skip(`content/${c}.json`);
  }

  // 3. Schema snapshot
  console.log('\n--- Schema ---');
  const snap = await get('/schema/snapshot', token);
  snap ? save('schema/snapshot.json', snap) : skip('schema/snapshot.json');

  // 4. Assets (copy from local uploads dir or download)
  console.log('\n--- Assets ---');
  const files = await get('/files', token);
  if (files) {
    const ad = resolve(SRC, 'assets');
    const ud = resolve(ROOT, 'backend', 'uploads');
    mkdirSync(ad, { recursive: true });
    for (const f of files) {
      const name = f.id + (extname(f.filename_download) || '');
      const p = resolve(ad, name);
      if (existsSync(p)) { console.log(`  ..  ${name}`); continue; }
      // Try local uploads dir first (Docker volume mount)
      const local = resolve(ud, f.filename_disk || name);
      if (existsSync(local)) {
        writeFileSync(p, readFileSync(local));
        console.log(`  OK  ${name} (local)`);
        continue;
      }
      // Fallback: download via API
      try {
        const r = await fetch(`${API}/assets/${f.id}?access_token=${token}`);
        if (r.ok) { writeFileSync(p, Buffer.from(await r.arrayBuffer())); console.log(`  OK  ${name}`); }
        else console.log(`  FAIL ${name} (HTTP ${r.status})`);
      } catch { console.log(`  FAIL ${name}`); }
    }
  }

  console.log('\nDone. Template saved to backend/template/src/');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
