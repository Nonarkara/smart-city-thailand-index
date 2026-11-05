import { execFileSync } from 'node:child_process';
import { parse } from 'csv-parse/sync';

/** Source rows must not escape through subprocess diagnostics or parser errors. */
export function readPrivateSource(url, execute = execFileSync) {
  try {
    if (new URL(url).protocol !== 'https:') throw new Error();
    return execute('curl', ['--fail', '--silent', '--show-error', '--max-time', '45', url], {
      maxBuffer: 32 * 1024 * 1024,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    // No cause: execution errors can contain the complete response and stderr.
    throw new Error('Source download failed; response details withheld.');
  }
}

export function parsePrivateCsv(text) {
  try {
    return parse(text, { columns: true, bom: true, skip_empty_lines: true });
  } catch {
    // CsvError carries the malformed record; do not rethrow or attach it.
    throw new Error('Source CSV could not be parsed; record details withheld.');
  }
}

export function parsePrivateJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Source catalogue could not be parsed; response details withheld.');
  }
}
