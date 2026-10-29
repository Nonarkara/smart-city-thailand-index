import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

describe('owner handwriting asset',()=>{
 it('retains the supplied font intact and serves a real WOFF2 conversion',()=>{
  const original=readFileSync('public/fonts/mascot/non-architecture-regular.ttf');
  expect(createHash('sha256').update(original).digest('hex')).toBe('d160b66088e0ab97ecd98b148e49a52d9396044653abca088d788b9c85f7aa76');
  expect(readFileSync('public/fonts/mascot/non-architecture-regular.woff2').subarray(0,4).toString()).toBe('wOF2');
 });
 it('records real Latin coverage without claiming unsupported Thai or Chinese handwriting',()=>{
  const record=JSON.parse(readFileSync('public/fonts/mascot/non-architecture.json','utf8'));
  for(const character of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')expect(record.codepoints).toContain(character.codePointAt(0));
  expect(record.codepoints.some((code:number)=>code>=0xe00&&code<=0xe7f)).toBe(false);
  expect(record.codepoints.some((code:number)=>code>=0x4e00&&code<=0x9fff)).toBe(false);
  expect(record.copyright).toContain('Non Arkaraprasertkul');
 });
});
