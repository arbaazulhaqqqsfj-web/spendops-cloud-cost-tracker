# SpendOps Backend Deployment Checklist

## Prepared locally

- [x] Lambda handler returning JSON
- [x] CORS headers for browser access
- [x] Automated Lambda response test
- [x] Sample DynamoDB cost-history records
- [x] Existing frontend preserved unchanged

## Complete after AWS activation

- [ ] Create Lambda function using the Node.js runtime
- [ ] Upload `lambda/index.mjs`
- [ ] Test the Lambda function in AWS
- [ ] Create an HTTP API in API Gateway
- [ ] Connect the `GET /costs` route to Lambda
- [ ] Copy the API endpoint
- [ ] Connect the SpendOps frontend to the endpoint
- [ ] Create a DynamoDB table for daily cost snapshots
- [ ] Replace Lambda mock data with DynamoDB reads
- [ ] Add CloudWatch log and error monitoring

## Data honesty

The prepared API still returns demonstration data. It becomes persistent when
DynamoDB is connected and becomes genuine AWS billing data only after a secure
Cost Explorer integration is added.
