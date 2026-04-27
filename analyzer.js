require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic();

async function analyzeCompliance(rules, score) {
  const criticalFailures = rules.filter(r => !r.isCompliant && r.isCritical);
  const nonCriticalFailures = rules.filter(r => !r.isCompliant && !r.isCritical);

  const prompt = `
You are an AWS Security and Compliance Expert specializing in SOC2, HIPAA and PCI-DSS frameworks.

COMPLIANCE SCAN RESULTS:
Score: ${score.complianceScore}%
Risk Level: ${score.riskLevel}
Total Rules: ${score.totalRules}
Compliant: ${score.compliantRules}
Non-Compliant: ${score.nonCompliantRules}
Critical Failures: ${score.criticalFailures}

CRITICAL FAILURES:
${JSON.stringify(criticalFailures, null, 2)}

NON-CRITICAL FAILURES:
${JSON.stringify(nonCriticalFailures, null, 2)}

Provide:
1. Executive summary of compliance posture
2. Top 3 critical issues to fix immediately with specific remediation steps
3. Which compliance frameworks are at risk (SOC2, HIPAA, PCI-DSS)
4. Estimated effort to reach 80% compliance score
5. Quick wins that can be fixed in under 30 minutes

Keep response under 400 words. Be specific and actionable.
  `;

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].text;
}

module.exports = { analyzeCompliance };
