import { describe, expect, it } from 'vitest';
// @ts-expect-error Runtime audit helper is deliberately plain Node JavaScript.
import { checkCityIndex, checkCityDetail, checkCityCsv, checkSnapshot, checkValidationRun } from '../scripts/lib/release-contract.mjs';
import { createHash } from 'node:crypto';
describe('release proof rejects nearby successes', () => {
  const city={id:'phuket',scores:{economy:80},compositeScore:72.6};
  it('rejects duplicated identities and stale scores even when JSON is valid', () => {
    expect(()=>checkCityIndex({success:true,data:[city,city]},[city])).toThrow(/duplicate/);
    expect(()=>checkCityDetail({success:true,data:{...city,compositeScore:73}},city)).toThrow(/differs/);
  });
  it('parses quoted CSV values and rejects another city', () => {
    const csv='city_id,value\nphuket,"a,b"\n';
    expect(()=>checkCityCsv(csv,csv,'phuket')).not.toThrow();
    expect(()=>checkCityCsv('city_id,value\nother,"a,b"\n',csv,'phuket')).toThrow(/another city/);
  });
  it('rejects changed research bytes even when size and JSON remain valid', () => {
    const bytes=Buffer.from('{"a":1}');
    const manifest={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
    expect(()=>checkSnapshot(Buffer.from('{"a":2}'),manifest)).toThrow(/hash/);
  });
  it('requires successful full-workflow validation of the exact release revision', () => {
    const head='a'.repeat(40);
    const run={workflowName:'Deploy to GitHub Pages',headSha:head,status:'completed',conclusion:'success'};
    expect(()=>checkValidationRun(run,head)).not.toThrow();
    for (const mutation of [{headSha:'b'.repeat(40)},{status:'in_progress'},{conclusion:'failure'},{workflowName:'Partial checks'}]) {
      expect(()=>checkValidationRun({...run,...mutation},head)).toThrow();
    }
  });
});
