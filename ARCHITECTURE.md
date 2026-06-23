# SpendOps Cloud Architecture

## Current state

The public dashboard is a static HTML, CSS, and JavaScript application hosted
on Vercel. Its values are demonstration data stored in `script.js`.

## Target serverless architecture

```text
Browser
  |
  v
CloudFront
  |
  v
Private S3 bucket
  |
  | HTTPS GET /costs
  v
API Gateway HTTP API
  |
  v
AWS Lambda
  |
  v
DynamoDB

CloudWatch receives Lambda logs and metrics.
AWS Budgets sends account-level cost notifications.
```

## Security decisions

- The S3 bucket remains private.
- CloudFront accesses S3 through Origin Access Control.
- The browser never receives AWS access keys.
- Lambda receives only the DynamoDB permissions it needs.
- Root-account MFA and an AWS Budget alert are configured first.
- Real Cost Explorer access will be added only through Lambda.

## Honest project stages

1. **Frontend MVP:** The dashboard displays mock data.
2. **Serverless MVP:** API Gateway and Lambda return demonstration JSON.
3. **Persistent MVP:** Lambda reads daily snapshots from DynamoDB.
4. **Real billing integration:** Lambda securely reads the owner's AWS Cost
   Explorer data. This stage requires explicit IAM permission and may incur
   API charges.

## Interview explanation

SpendOps separates the static frontend from the backend API. CloudFront serves
the frontend globally, API Gateway exposes a small HTTP interface, Lambda runs
the cost-processing logic, and DynamoDB stores daily snapshots. No AWS
credentials are placed in browser code.
