# Releasing

A release is a tag. Nothing is published by a merge.

1. In a pull request, set the new version in **both** `package.json` and `protocol.json` (CI checks that they agree). Merge it.
2. Tag the merge and push the tag:

   ```bash
   git checkout main && git pull
   git tag v0.1.1
   git push origin v0.1.1
   ```

3. The `Publish` workflow validates (`scripts/validate.mjs`, with the tag checked against the version) and runs `npm publish`. If the environment `npm` requires a reviewer, approve the run first.

A version on npm cannot be replaced: a mistake is a new version, never a re-tag.

## Set once, on npmjs.com (by a person with rights on the package)

Package `@gratiaos/protocol` → Settings → Trusted Publisher → GitHub Actions:

| Field | Value |
| --- | --- |
| Organization or user | `GratiaOS` |
| Repository | `protocol` |
| Workflow filename | `publish.yml` |
| Environment | `npm` |

The workflow filename must match exactly (a mismatch shows up as `E404` on publish). Once it works, the package can be set to
"Require two-factor authentication and disallow tokens" so that CI is the only way to publish.

## Set once, on GitHub

- Settings → Environments → New environment `npm`. Optional: add yourself as a required reviewer, and restrict the tags that may deploy to `v*`.
- Settings → Actions → General: the actions of GitHub (`actions/checkout`, `actions/setup-node`) must be allowed.
