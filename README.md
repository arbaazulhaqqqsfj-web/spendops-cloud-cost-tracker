# SpendOps Backend

This folder contains the deployment-ready serverless backend while preserving
the original dashboard.

## Run locally

From this folder:

```powershell
node local-server.mjs
```

Open:

```text
http://127.0.0.1:3000/costs
```

## Run tests

```powershell
cd lambda
node --test
```

## AWS deployment files

- `template.yaml`: AWS SAM infrastructure template
- `lambda/index.mjs`: Lambda handler
- `openapi.yaml`: API contract
- `sample-data/dynamodb-items.json`: example cost-history records
- `ARCHITECTURE.md`: architecture and security decisions

The API currently returns demonstration data. It does not claim to return real
AWS billing information.
