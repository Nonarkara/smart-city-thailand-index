import { describe, expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
// @ts-expect-error Audit helpers run directly as plain Node JavaScript.
import { parsePrivateCsv, parsePrivateJson, readPrivateSource } from '../scripts/lib/private-source.mjs';

const canary = 'SCITI_SYNTHETIC_PRIVATE_ROW';
const helperUrl = pathToFileURL(resolve('scripts/lib/private-source.mjs')).href;
function runFailure(code: string) {
  return spawnSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8' });
}

describe('private source failure boundary', () => {
  it('preserves valid CSV values, quoted fields, zero and the catalogue', () => {
    expect(parsePrivateCsv('\uFEFFprovince,count,note\nexample,0,"a,b"\n')).toEqual([
      { province: 'example', count: '0', note: 'a,b' },
    ]);
    expect(parsePrivateJson('{"success":true}')).toEqual({ success: true });
  });

  it('proves malformed CSV originally leaks its row, then withholds it on the safe path', () => {
    const csv = `a,b\n${canary},x,y\n`;
    const original = runFailure(`import {parse} from 'csv-parse/sync'; parse(${JSON.stringify(csv)}, {columns:true});`);
    expect(original.status).not.toBe(0);
    expect(original.stderr).toContain(canary);
    const safe = runFailure(`import {parsePrivateCsv} from ${JSON.stringify(helperUrl)}; parsePrivateCsv(${JSON.stringify(csv)});`);
    expect(safe.status).not.toBe(0);
    expect(safe.stderr).toContain('Source CSV could not be parsed');
    expect(safe.stdout + safe.stderr).not.toContain(canary);
    expect(safe.stderr).not.toContain('CsvError');
  });

  it('withholds subprocess output and stderr, without copying the original error or cause', () => {
    const child = `process.stdout.write(${JSON.stringify(canary)}); process.stderr.write(${JSON.stringify(canary)}); process.exit(1);`;
    const safe = runFailure(`
      import {execFileSync} from 'node:child_process';
      import {readPrivateSource} from ${JSON.stringify(helperUrl)};
      readPrivateSource('https://data.go.th/synthetic-only', (_command, _args, options) => {
        return execFileSync(process.execPath, ['-e', ${JSON.stringify(child)}], options);
      });
    `);
    expect(safe.status).not.toBe(0);
    expect(safe.stderr).toContain('Source download failed');
    expect(safe.stdout + safe.stderr).not.toContain(canary);
    expect(safe.stderr).not.toContain('[cause]');
  });

  it('requires HTTPS and keeps the bounded downloader diagnostics piped', () => {
    let called = false;
    expect(() => readPrivateSource('http://data.go.th/synthetic-only', () => { called = true; })).toThrow(/Source download failed/);
    expect(called).toBe(false);
    const value = readPrivateSource('https://data.go.th/synthetic-only', (command: string, args: string[], options: Parameters<typeof execFileSync>[2]) => {
      expect(command).toBe('curl');
      expect(args).toEqual(['--fail', '--silent', '--show-error', '--max-time', '45', 'https://data.go.th/synthetic-only']);
      expect(options).toEqual({ maxBuffer: 32 * 1024 * 1024, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return 'synthetic response';
    });
    expect(value).toBe('synthetic response');
  });

  it('does not print a malformed catalogue response', () => {
    const safe = runFailure(`import {parsePrivateJson} from ${JSON.stringify(helperUrl)}; parsePrivateJson(${JSON.stringify(canary)});`);
    expect(safe.status).not.toBe(0);
    expect(safe.stderr).toContain('Source catalogue could not be parsed');
    expect(safe.stdout + safe.stderr).not.toContain(canary);
  });
});
