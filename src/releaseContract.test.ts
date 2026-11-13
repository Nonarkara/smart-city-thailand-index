import { describe, expect, it } from 'vitest';
// @ts-expect-error Runtime audit helper is deliberately plain Node JavaScript.
import { checkCityIndex, checkCityDetail, checkCityCsv, checkSnapshot, checkValidationRun, checkRenderedValidationRun, RENDERED_RELEASE_GATES } from '../scripts/lib/release-contract.mjs';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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
  it('keeps remote validation requirements aligned with both actual workflow jobs', () => {
    const workflow = readFileSync('.github/workflows/github-pages.yml', 'utf8');
    // Deliberately derive the other side from the workflow, not the requirements
    // array: deleting a gate from that array alone must fail this test.
    const jobs = [...workflow.matchAll(/^ {2}(verify|deploy):\n([\s\S]*?)(?=^ {2}[\w-]+:|$(?![\s\S]))/gm)];
    expect(jobs.map(job => job[1]).sort()).toEqual(['deploy', 'verify']);
    for (const [, name, body] of jobs) {
      const commands = [...body.matchAll(/^\s+- run: (.+)$/gm)]
        .map(match => match[1].trim())
        .filter(command => /^(?:npm audit\b|npm run (?:lint|test:run|build)$|node scripts\/audit\/)/.test(command));
      expect([...RENDERED_RELEASE_GATES].sort(), `${name} gate drift`).toEqual([...commands].sort());
      expect(commands, `${name} must retain the original missing gate`).toContain('node scripts/audit/page-budget.mjs --serve');
    }
  });
  it('rejects omitted or skipped rendered gates even when the workflow is green', () => {
    const head='a'.repeat(40);
    const steps=RENDERED_RELEASE_GATES.map((name:string)=>({name:'Run '+name,conclusion:'success'}));
    const run={workflowName:'Deploy to GitHub Pages',headSha:head,status:'completed',conclusion:'success',jobs:[{steps}]};
    expect(()=>checkRenderedValidationRun(run,head)).not.toThrow();
    expect(()=>checkRenderedValidationRun({...run,jobs:[]},head)).toThrow(/required gate/);
    for(const command of RENDERED_RELEASE_GATES){
      expect(()=>checkRenderedValidationRun({...run,jobs:[{steps:steps.filter((s:{name:string})=>s.name!=='Run '+command)}]},head)).toThrow(/required gate/);
      expect(()=>checkRenderedValidationRun({...run,jobs:[{steps:steps.map((s:{name:string})=>s.name==='Run '+command?{...s,conclusion:'skipped'}:s)}]},head)).toThrow(/required gate/);
    }
    expect(()=>checkRenderedValidationRun(run,'b'.repeat(40))).toThrow(/another revision/);
  });
  it('publishes dist once through the Pages artifact and keeps other uploads for 3 days', () => {
    const workflow = readFileSync('.github/workflows/github-pages.yml', 'utf8');
    expect(workflow).not.toContain('name: site-dist');
    const pagesUpload = workflow.indexOf('uses: actions/upload-pages-artifact@v3');
    const deploy = workflow.indexOf('uses: actions/deploy-pages@v4');
    expect(pagesUpload).toBeGreaterThan(-1);
    expect(deploy).toBeGreaterThan(pagesUpload);
    expect(workflow.slice(pagesUpload, deploy)).toContain('path: dist');
    const uploads = workflow.split(/\n\s+- uses: /).filter(step => step.startsWith('actions/upload-artifact@v4'));
    expect(uploads).toHaveLength(2);
    for (const step of uploads) {
      expect(step).toContain('retention-days: 3');
      expect(step).not.toContain('path: dist');
      expect(step).toContain('if: failure()');
    }
  });

});
