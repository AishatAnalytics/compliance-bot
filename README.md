# Compliance Bot 🏛️

Automated AWS compliance scanner that checks Config rules and uses Claude AI to generate risk-ranked reports.

## The Problem
Enterprise companies need to prove compliance with SOC2, HIPAA and PCI-DSS. Manually checking AWS Config rules every week takes hours and is error-prone.

## What It Does
- Scans AWS Config compliance rules automatically
- Scores your account compliance posture out of 100%
- Identifies critical failures vs non-critical issues
- Sends findings to Claude AI for expert analysis
- Maps findings to SOC2, HIPAA and PCI-DSS frameworks
- Emails a risk-ranked report with remediation steps

## Sample Output
Compliance Score: 0%
Risk Level: HIGH
Critical Failures: 5

Claude identified:
- Enable MFA on root account immediately
- Enable CloudTrail for audit logging
- Restrict S3 bucket public access
- Estimated 2-4 hours to reach 80% compliance

## Tech Stack
- AWS Config
- AWS SES
- Claude API (Anthropic)
- Node.js

## Key Concepts Demonstrated
- Compliance automation
- AWS Well-Architected Security Pillar
- SOC2 and HIPAA frameworks
- Risk scoring and prioritization

## Part of my 30 cloud projects in 30 days series
Follow along: https://www.linkedin.com/in/aishatolatunji/