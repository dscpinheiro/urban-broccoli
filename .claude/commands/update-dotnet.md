Update all .NET version references in the repository to the version passed as an argument (e.g. `10.0`).

The argument is the major.minor version, e.g. `10.0`. Derive the values used in each file from it:
- **TFM** (TargetFramework moniker): `net<arg>` — e.g. `net10.0`
- **SDK version wildcard** (for GitHub Actions `dotnet-version`): `<arg>.x` — e.g. `10.0.x`

## Step 1 — Update the three .csproj files

In each of the following files, replace the existing `<TargetFramework>` value with the new TFM:
- `NameGenerator/NameGenerator.csproj`
- `RandomGen/RandomGen.csproj`

## Step 2 — Update the GitHub Actions workflow

In `.github/workflows/main.yml`, replace the `dotnet-version` value with the new SDK version wildcard.

## Step 3 — Verify

Re-read all four files and confirm every version reference was updated correctly. Report the old version and new version, and list all files changed.
