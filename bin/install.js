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

const REPO_URL = 'https://github.com/maxlogvn/webbase-startkit.git';

// User cố định trong template, dùng để gắn static token cho frontend
const FRONTEND_BOT_USER_ID = '88a6e8cf-f0f8-41db-a3a2-8a9741c086cc'; // -> DIRECTUS_SERVER_TOKEN
const WEBMASTER_USER_ID = 'd56956bf-6ed0-465e-bb4a-ec9bde65c5f0'; // -> DIRECTUS_ADMIN_TOKEN

const TOTAL_STEPS = 8;

function log(step, total, message) {
    console.log(`[${step}/${total}] ${message}`);
}

function fail(message) {
    console.error('');
    console.error(`Loi: ${message}`);
    process.exit(1);
}

function run(cmd, args, opts = {}) {
    const { input, ...rest } = opts;
    const stdio = input ? ['pipe', 'inherit', 'inherit'] : 'inherit';
    const result = spawnSync(cmd, args, { stdio, shell: true, ...rest, input });
    if (result.error) {
        fail(`Khong the chay lenh "${cmd}": ${result.error.message}`);
    }
    if (result.status !== 0) {
        fail(`Lenh "${cmd} ${args.join(' ')}" ket thuc voi loi (exit code ${result.status}).`);
    }
}

function checkRequiredTools() {
    const tools = [
        { cmd: 'git', args: ['--version'], hint: 'Cai Git: https://git-scm.com' },
        { cmd: 'docker', args: ['--version'], hint: 'Cai Docker: https://docs.docker.com/get-docker' },
        { cmd: 'pnpm', args: ['--version'], hint: 'Cai pnpm: npm install -g pnpm' },
        { cmd: 'node', args: ['--version'], hint: 'Cai Node.js >= 18: https://nodejs.org' },
    ];
    for (const tool of tools) {
        const result = spawnSync(tool.cmd, tool.args, { stdio: 'ignore', shell: true });
        if (result.error || result.status !== 0) {
            fail(`Khong tim thay "${tool.cmd}" tren may. ${tool.hint}`);
        }
    }
}

async function promptTargetDir() {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    const answer = await rl.question(
        'Nhap thu muc cai dat (Enter de dung thu muc hien tai "."): ',
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
        `Directus khong san sang sau ${Math.round(timeoutMs / 1000)}s. ` +
        `Kiem tra log container bang: docker compose logs directus. (${lastError})`,
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
            fail('Thu muc hien tai khong trong. Hay chay script trong mot thu muc trong, hoac nhap ten thu muc moi.');
        }
    } else if (existsSync(targetDir) && !isDirEmpty(targetDir)) {
        fail(`Thu muc "${targetDir}" da ton tai va khong trong. Chon ten khac hoac xoa thu muc cu.`);
    }

    log(1, TOTAL_STEPS, `Clone repo vao "${targetDir === '.' ? 'thu muc hien tai' : targetDir}"...`);
    if (isCurrentDir) {
        // git clone vao thu muc hien tai (phai rong)
        run('git', ['clone', '--depth', '1', REPO_URL, '.']);
    } else {
        run('git', ['clone', '--depth', '1', REPO_URL, targetDir]);
    }

    const root = path.resolve(targetDir);
    const backendDir = path.join(root, 'backend');
    const svelteDir = path.join(root, 'svelte');

    log(2, TOTAL_STEPS, 'Tao file backend/.env...');
    copyFileSync(path.join(backendDir, '.env.example'), path.join(backendDir, '.env'));
    const backendEnv = readFileSync(path.join(backendDir, '.env'), 'utf-8');
    const adminEmail = readEnvValue(backendEnv, 'ADMIN_EMAIL', 'admin@example.com');
    const adminPassword = readEnvValue(backendEnv, 'ADMIN_PASSWORD', 'd1r3ctu5');
    const directusPort = readEnvValue(backendEnv, 'DIRECTUS_PORT', '8055');
    const directusUrl = `http://localhost:${directusPort}`;

    log(3, TOTAL_STEPS, 'Khoi dong Directus bang Docker Compose (lan dau se mat vai phut de pull image)...');
    run('docker', ['compose', '-f', 'docker-compose.yaml', 'up', '-d'], { cwd: backendDir });

    log(4, TOTAL_STEPS, `Dang cho Directus san sang tai ${directusUrl}...`);
    await waitForDirectus(directusUrl);

    log(5, TOTAL_STEPS, 'Ap dung schema va noi dung mau vao Directus (directus-template-cli)...');
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

    log(6, TOTAL_STEPS, 'Tao static token cho frontend...');
    const loginRes = await fetch(`${directusUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });
    if (!loginRes.ok) {
        fail('Dang nhap Directus thay bai, khong the tao static token cho frontend.');
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
            fail(`Khong tao duoc static token cho user ${userId}.`);
        }
    }

    log(7, TOTAL_STEPS, 'Tao file svelte/.env...');
    let svelteEnv = readFileSync(path.join(svelteDir, '.env.example'), 'utf-8');
    svelteEnv = replaceEnvValue(svelteEnv, 'PUBLIC_DIRECTUS_URL', directusUrl);
    svelteEnv = replaceEnvValue(svelteEnv, 'PUBLIC_SITE_URL', 'http://localhost:3000');
    svelteEnv = replaceEnvValue(svelteEnv, 'DIRECTUS_SERVER_TOKEN', serverToken);
    svelteEnv = replaceEnvValue(svelteEnv, 'DIRECTUS_ADMIN_TOKEN', adminToken);
    writeFileSync(path.join(svelteDir, '.env'), svelteEnv);

    log(8, TOTAL_STEPS, 'Cai dat dependencies cho frontend (pnpm install)...');
    writeFileSync(path.join(svelteDir, '.npmrc'), 'onlyBuiltDependencies[]=esbuild\nonlyBuiltDependencies[]=sharp\n');
    run('pnpm', ['install'], { cwd: svelteDir });

    const svelteRelDir = isCurrentDir ? 'svelte' : path.join(targetDir, 'svelte');

    console.log('');
    console.log('Hoan tat.');
    console.log('');
    console.log('Thong tin admin Directus:');
    console.log(`  URL:      ${directusUrl}`);
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log('');
    console.log('De chay frontend:');
    console.log(`  cd ${svelteRelDir}`);
    console.log('  pnpm run dev');
    console.log('');
    console.log('Sau khi chay, mo http://localhost:3000');
}

main().catch((err) => fail(err.message));