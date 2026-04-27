require('dotenv').config();
const { getComplianceRules, scoreCompliance } = require('./scanner');
const { analyzeCompliance } = require('./analyzer');
const { sendComplianceReport } = require('./mailer');
const fs = require('fs');

async function run() {
  console.log('🏛️ Compliance Bot');
  console.log('=================\n');

  // Step 1 — Scan compliance rules
  console.log('Step 1: Scanning AWS Config compliance rules...');
  const rules = await getComplianceRules();

  // Step 2 — Score compliance
  console.log('Step 2: Calculating compliance score...');
  const score = scoreCompliance(rules);

  console.log(`\nCompliance Score: ${score.complianceScore}%`);
  console.log(`Risk Level: ${score.riskLevel}`);
  console.log(`Critical Failures: ${score.criticalFailures}`);
  console.log(`Total Rules Checked: ${score.totalRules}`);

  // Step 3 — Analyze with Claude
  console.log('\nStep 3: Sending to Claude AI for analysis...');
  const analysis = await analyzeCompliance(rules, score);

  console.log('\n=============================');
  console.log('🤖 CLAUDE COMPLIANCE ANALYSIS');
  console.log('=============================\n');
  console.log(analysis);

  // Step 4 — Send email report
  console.log('\nStep 4: Sending compliance report via email...');
  await sendComplianceReport(rules, score, analysis);

  // Step 5 — Save report
  const report = {
    timestamp: new Date().toISOString(),
    score,
    rules,
    claudeAnalysis: analysis
  };

  fs.writeFileSync('compliance-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Full report saved to compliance-report.json');
  console.log('\n✅ Compliance Bot complete!');
}

run().catch(console.error);