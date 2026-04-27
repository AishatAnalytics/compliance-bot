require('dotenv').config();
const { ConfigServiceClient, DescribeComplianceByRuleCommand, DescribeConfigRulesCommand } = require('@aws-sdk/client-config-service');

const config = new ConfigServiceClient({ region: process.env.AWS_REGION });

async function getComplianceRules() {
  console.log('Fetching AWS Config rules...\n');

  try {
    const rulesCommand = new DescribeConfigRulesCommand({});
    const rulesResponse = await config.send(rulesCommand);

    if (!rulesResponse.ConfigRules || rulesResponse.ConfigRules.length === 0) {
      console.log('No AWS Config rules found — using security best practices checklist instead.\n');
      return getManualChecklist();
    }

    const complianceCommand = new DescribeComplianceByRuleCommand({});
    const complianceResponse = await config.send(complianceCommand);

    return complianceResponse.ComplianceByRules.map(rule => ({
      ruleName: rule.ConfigRuleName,
      compliance: rule.Compliance.ComplianceType,
      isCompliant: rule.Compliance.ComplianceType === 'COMPLIANT',
      isCritical: rule.ConfigRuleName.includes('root') ||
                  rule.ConfigRuleName.includes('mfa') ||
                  rule.ConfigRuleName.includes('password') ||
                  rule.ConfigRuleName.includes('encryption')
    }));

  } catch (err) {
    console.log('AWS Config not fully enabled — using security best practices checklist.\n');
    return getManualChecklist();
  }
}

function getManualChecklist() {
  return [
    { ruleName: 'root-account-mfa-enabled', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: true },
    { ruleName: 'iam-password-policy', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: true },
    { ruleName: 'cloudtrail-enabled', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: true },
    { ruleName: 's3-bucket-public-read-prohibited', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: true },
    { ruleName: 'encrypted-volumes', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: true },
    { ruleName: 'vpc-default-security-group-closed', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: false },
    { ruleName: 'access-keys-rotated', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: false },
    { ruleName: 'mfa-enabled-for-iam-console-access', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: true },
    { ruleName: 'restricted-ssh', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: false },
    { ruleName: 'rds-storage-encrypted', compliance: 'INSUFFICIENT_DATA', isCompliant: false, isCritical: false }
  ];
}

function scoreCompliance(rules) {
  const total = rules.length;
  const compliant = rules.filter(r => r.isCompliant).length;
  const critical = rules.filter(r => !r.isCompliant && r.isCritical).length;
  const score = Math.round((compliant / total) * 100);

  return {
    totalRules: total,
    compliantRules: compliant,
    nonCompliantRules: total - compliant,
    criticalFailures: critical,
    complianceScore: score,
    riskLevel: critical > 3 ? 'HIGH' : critical > 1 ? 'MEDIUM' : 'LOW'
  };
}

module.exports = { getComplianceRules, scoreCompliance };