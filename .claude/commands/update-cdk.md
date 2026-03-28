Update the `s3-backup-cdk` project to the latest AWS CDK version. Follow these steps exactly:

## Step 1 — Find the latest CDK version
Run `npm show aws-cdk version` to get the latest published version. This is the target version for both `aws-cdk` and `aws-cdk-lib`.

## Step 2 — Scaffold a fresh CDK app in a temp directory
First create a temp directory with `mktemp -d /tmp/cdk-sample-XXXXX`, then run `cdk init app --language typescript` inside it (e.g. `cd /tmp/cdk-sample-XXXXX && cdk init app --language typescript`). This gives you the canonical `package.json` and `cdk.json` for this CDK version to use as a reference.

## Step 3 — Update `s3-backup-cdk/package.json`
Compare the scaffolded `package.json` with the current one. Update the following to match the scaffold's versions:
- `aws-cdk` (devDependency) — pin to the exact target version (no `^`)
- `aws-cdk-lib` (dependency) — pin to the exact target version (no `^`)
- `constructs` (dependency)
- `typescript` (devDependency)
- `ts-node` (devDependency)
- `ts-jest` (devDependency)
- `jest` (devDependency)
- `@types/jest` (devDependency)
- `@types/node` (devDependency)

Keep all other fields in `package.json` unchanged (name, bin, scripts, etc.).

## Step 4 — Update `s3-backup-cdk/cdk.json`
The `context` block contains CDK feature flags that change with each release. Replace the entire `context` block with the one from the scaffolded `cdk.json`.

**Preserve these custom fields exactly as they are — do not take them from the scaffold:**
- `app` (custom entry point: `npx ts-node --prefer-ts-exts bin/bkp-app.ts`)
- `versionReporting`
- `assetMetadata`
- `watch`

## Step 5 — Install dependencies
Delete `s3-backup-cdk/node_modules/` and `s3-backup-cdk/package-lock.json`, then run `npm install` inside `s3-backup-cdk/`.

## Step 6 — Run the tests
Run `npm test` inside `s3-backup-cdk/`.
- If all tests pass, you're done.
- If only snapshot tests fail (i.e. the diff is expected CloudFormation template changes from the CDK update), re-run with `npm test -- --updateSnapshot` to accept the new snapshots.
- If non-snapshot tests fail, report the failure and stop — do not update snapshots until the underlying issue is understood.

## Step 7 — Clean up
Delete the temporary directory created in Step 2.

## Step 8 — Report
Summarise what changed: the old CDK version, the new CDK version, any package version bumps, whether the cdk.json context changed, and whether snapshots were updated.

Also remind the user to update the global CDK CLI to match:
```
$ npm install -g aws-cdk
```
