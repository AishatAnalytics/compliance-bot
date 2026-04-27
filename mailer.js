require('dotenv').config();
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: 'us-east-1' });

async function sendComplianceReport(rules, score, analysis) {
  const criticalFailures = rules.filter(r => !r.isCompliant && r.isCritical);

  const message = `
AWS COMPLIANCE BOT REPORT
==========================
Date: ${new Date().toDateString()}

COMPLIANCE SCORE: ${score.complianceScore}%
RISK LEVEL: ${score.riskLevel}
CRITICAL FAILURES: ${score.criticalFailures}

---
SCORE BREAKDOWN
---
Total Rules Checked: ${score.totalRules}
Compliant:           ${score.compliantRules}
Non-Compliant:       ${score.nonCompliantRules}

---
CRITICAL ISSUES
---
${criticalFailures.map(r => `❌ ${r.ruleName}`).join('\n')}

---
CLAUDE AI ANALYSIS
---
${analysis}

---
Stay compliant. Stay secure.
The Compliance Bot 🏛️
  `;

  await ses.send(new SendEmailCommand({
    Source: process.env.YOUR_EMAIL,
    Destination: { ToAddresses: [process.env.YOUR_EMAIL] },
    Message: {
      Subject: {
        Data: `AWS Compliance Report — Score: ${score.complianceScore}% — Risk: ${score.riskLevel}`
      },
      Body: { Text: { Data: message } }
    }
  }));

  console.log('📧 Compliance report sent to', process.env.YOUR_EMAIL);
}

module.exports = { sendComplianceReport };
