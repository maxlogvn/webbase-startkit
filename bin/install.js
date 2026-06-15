#!/usr/bin/env node

/**
 * CLI tự động hóa các bước trong README của webbase-startkit:
 *  1. Hỏi thư mục cài đặt (mặc định: thư mục hiện tại)
 *  2. Clone repo vào thư mục đó
 *  3. Tạo backend/.env và khởi động Directus bằng Docker Compose
 *  4. Chờ Directus sẵn sàng
 *  5. Apply schema + nội dung mẫu (directus-template-cli)
 *  6. Tạo static token cho frontend (Webmaster + Frontend Bot)
 *  7. Tạo svelte/.env với các token vừa tạo
 *  8. pnpm install
 *
 * Cách dùng:
 *   npx github:maxlogvn/webbase-startkit
 */

import { spawnSync } from 'node:child_process';
import {
    existsSync,
    readdirSync,
    readFileSync,
    writeFileSync,
    copyFileSync,
} from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { createRequire } from 'node:module';

const REPO_URL = 'https://github.com/maxlogvn/webbase-startkit.git';
const require = createRequire(import.meta.url);
const { version: APP_VERSION } = require('../package.json');

// User cố định trong template, dùng để gắn static token cho frontend
const FRONTEND_BOT_USER_ID = '88a6e8cf-f0f8-41db-a3a2-8a9741c086cc'; // -> DIRECTUS_SERVER_TOKEN
const WEBMASTER_USER_ID = 'd56956bf-6ed0-465e-bb4a-ec9bde65c5f0'; // -> DIRECTUS_ADMIN_TOKEN

const TOTAL_STEPS = 8;

const colors = {
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
    reset: '\x1b[0m',
};

function stripAnsi(str) {
    return str.replace(/\x1b\[\d+m/g, '');
}

function log(step, total, message) {
    console.log(` ${colors.cyan}[${step}/${total}]${colors.reset} ${message}`);
}

function fail(message) {
    console.error(`\n ${colors.red}ERROR:${colors.reset} ${message}\n`);
    process.exit(1);
}

function printSummary(directusUrl, adminEmail, adminPassword, svelteRelDir) {
    console.clear();
    const w = 40;
    const hr = '\u2500'.repeat(w);
    const line = (content = '') => {
        const pad = w - stripAnsi(content).length;
        const left = Math.floor(pad / 2);
        const right = pad - left;
        return `  ${colors.bold}\u2551${colors.reset}  ${' '.repeat(left)}${content}${' '.repeat(right)}  ${colors.bold}\u2551${colors.reset}`;
    };
    const top = `  ${colors.bold}\u2554${'\u2550'.repeat(w + 4)}\u2557${colors.reset}`;
    const bottom = `  ${colors.bold}\u255a${'\u2550'.repeat(w + 4)}\u255d${colors.reset}`;
    const divider = `  ${colors.bold}\u2551${colors.reset}  ${colors.dim}${hr}${colors.reset}  ${colors.bold}\u2551${colors.reset}`;
    const empty = line();

    console.log(top);
    console.log(line(`${colors.cyan}${colors.bold}  WEBBASE STARTKIT - READY${colors.reset}  ${colors.dim}v${APP_VERSION}${colors.reset}`));
    console.log(divider);
    console.log(line(`${colors.yellow}  Directus Admin${colors.reset}`));
    console.log(line(`    URL:      ${directusUrl}`));
    console.log(line(`    Email:    ${adminEmail}`));
    console.log(line(`    Password: ${adminPassword}`));
    console.log(empty);
    console.log(line(`${colors.green}  Frontend${colors.reset}`));
    console.log(line(`    cd ${svelteRelDir}`));
    console.log(line(`    pnpm run dev`));
    console.log(line(`    Open ${colors.cyan}http://localhost:3000${colors.reset}`));
    console.log(bottom);
    console.log('');
}

function run(cmd, args, opts = {}) {
    const { input, ...rest } = opts;
    const stdio = input ? ['pipe', 'inherit', 'inherit'] : 'inherit';
    const result = spawnSync(cmd, args, { stdio, shell: true, ...rest, input });
    if (result.error) {
        fail(`Failed to run "${cmd}": ${result.error.message}`);
    }
    if (result.status !== 0) {
        fail(`Command "${cmd} ${args.join(' ')}" exited with code ${result.status}.`);
    }
}

function checkRequiredTools() {
    const tools = [
        { cmd: 'git', args: ['--version'], hint: 'Install Git: https://git-scm.com' },
        { cmd: 'docker', args: ['--version'], hint: 'Install Docker: https://docs.docker.com/get-docker' },
        { cmd: 'pnpm', args: ['--version'], hint: 'Install pnpm: npm install -g pnpm' },
        { cmd: 'node', args: ['--version'], hint: 'Install Node.js >= 18: https://nodejs.org' },
    ];
    for (const tool of tools) {
        const result = spawnSync(tool.cmd, tool.args, { stdio: 'ignore', shell: true });
        if (result.error || result.status !== 0) {
            fail(`"${tool.cmd}" not found. ${tool.hint}`);
        }
    }
}

async function promptTargetDir() {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    const answer = await rl.question(
        '  Install directory (Enter for current "."): ',
    );
    rl.close();
    const target = answer.trim() || '.';
    return target;
}

function isDirEmpty(dir) {
    if (!existsSync(dir)) return true;
    const entries = readdirSync(dir).filter((name) => name !== '.git');
    return entries.length === 0;
}

async function waitForDirectus(url, timeoutMs = 5 * 60 * 1000) {
    const start = Date.now();
    let lastError = '';
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(`${url}/server/health`);
            if (res.status !== 502) return;
        } catch (err) {
            lastError = err.message;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    fail(
        `Directus not ready after ${Math.round(timeoutMs / 1000)}s. ` +
        `Check container logs: docker compose logs directus. (${lastError})`,
    );
}

function readEnvValue(content, key, fallback) {
    const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : fallback;
}

function replaceEnvValue(content, key, value) {
    const pattern = new RegExp(`^${key}=.*$`, 'm');
    if (pattern.test(content)) {
        return content.replace(pattern, `${key}=${value}`);
    }
    return `${content}\n${key}=${value}\n`;
}

async function main() {
    checkRequiredTools();

    const targetDir = await promptTargetDir();
    const isCurrentDir = targetDir === '.' || targetDir === './';

    if (isCurrentDir) {
        if (!isDirEmpty('.')) {
            fail('Current directory is not empty. Run in an empty directory or specify a new folder name.');
        }
    } else if (existsSync(targetDir) && !isDirEmpty(targetDir)) {
        fail(`Directory "${targetDir}" already exists and is not empty. Choose another name or delete it.`);
    }

    log(1, TOTAL_STEPS, `Cloning repository into "${targetDir}"...`);
    if (isCurrentDir) {
        run('git', ['clone', '--depth', '1', REPO_URL, '.']);
    } else {
        run('git', ['clone', '--depth', '1', REPO_URL, targetDir]);
    }

    const root = path.resolve(targetDir);
    const backendDir = path.join(root, 'backend');
    const svelteDir = path.join(root, 'svelte');

    log(2, TOTAL_STEPS, 'Creating backend environment file...');
    copyFileSync(path.join(backendDir, '.env.example'), path.join(backendDir, '.env'));
    const backendEnv = readFileSync(path.join(backendDir, '.env'), 'utf-8');
    const adminEmail = readEnvValue(backendEnv, 'ADMIN_EMAIL', 'admin@example.com');
    const adminPassword = readEnvValue(backendEnv, 'ADMIN_PASSWORD', 'd1r3ctu5');
    const directusPort = readEnvValue(backendEnv, 'DIRECTUS_PORT', '8055');
    const directusUrl = `http://localhost:${directusPort}`;

    log(3, TOTAL_STEPS, 'Starting Directus via Docker Compose (first run pulls images)...');
    run('docker', ['compose', '-f', 'docker-compose.yaml', 'up', '-d'], { cwd: backendDir });

    log(4, TOTAL_STEPS, `Waiting for Directus at ${directusUrl}...`);
    await waitForDirectus(directusUrl);

    log(5, TOTAL_STEPS, 'Applying template schema and content via directus-template-cli...');
    run(
        'npx',
        [
            '--yes',
            'directus-template-cli@latest',
            'apply',
            '-p',
            `--directusUrl=${directusUrl}`,
            `--userEmail=${adminEmail}`,
            `--userPassword=${adminPassword}`,
            '--templateLocation=./template',
            '--templateType=local',
        ],
        { cwd: backendDir },
    );

    log(6, TOTAL_STEPS, 'Generating static tokens for frontend...');
    const loginRes = await fetch(`${directusUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });
    if (!loginRes.ok) {
        fail('Directus login failed. Could not generate static tokens.');
    }
    const loginData = await loginRes.json();
    const accessToken = loginData.data.access_token;

    const serverToken = crypto.randomBytes(24).toString('hex');
    const adminToken = crypto.randomBytes(24).toString('hex');

    const tokenAssignments = [
        [FRONTEND_BOT_USER_ID, serverToken],
        [WEBMASTER_USER_ID, adminToken],
    ];
    for (const [userId, token] of tokenAssignments) {
        const res = await fetch(`${directusUrl}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ token }),
        });
        if (!res.ok) {
            fail(`Failed to set static token for user ${userId}.`);
        }
    }

    log(7, TOTAL_STEPS, 'Creating Svelte environment file...');
    let svelteEnv = readFileSync(path.join(svelteDir, '.env.example'), 'utf-8');
    svelteEnv = replaceEnvValue(svelteEnv, 'PUBLIC_DIRECTUS_URL', directusUrl);
    svelteEnv = replaceEnvValue(svelteEnv, 'PUBLIC_SITE_URL', 'http://localhost:3000');
    svelteEnv = replaceEnvValue(svelteEnv, 'DIRECTUS_SERVER_TOKEN', serverToken);
    svelteEnv = replaceEnvValue(svelteEnv, 'DIRECTUS_ADMIN_TOKEN', adminToken);
    writeFileSync(path.join(svelteDir, '.env'), svelteEnv);

    log(8, TOTAL_STEPS, 'Installing frontend dependencies (pnpm install)...');

    run('pnpm', ['install', '--ignore-scripts'], { cwd: svelteDir });
    run('pnpm', ['rebuild', 'esbuild', 'sharp'], { cwd: svelteDir });

    const svelteRelDir = isCurrentDir ? 'svelte' : path.join(targetDir, 'svelte');

    printSummary(directusUrl, adminEmail, adminPassword, svelteRelDir);
}

main().catch((err) => fail(err.message));