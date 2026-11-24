# Releasing

A merge to `main` publishes when the version in `package.json` is not on npm yet. The bump of the version is the word.

1. In a pull request, set the new version in **both** `package.json` and `protocol.json` (CI checks that they agree). Merge it.
2. The `Publish` workflow validates, sees that the version is new, and runs `npm publish`. Afterwards it tags the release
   (`vX.Y.Z`) and writes a release on GitHub. If the environment `npm` requires a reviewer, approve the run first.

A merge that leaves the version as it is publishes nothing. A version on npm cannot be replaced: a mistake is a new version.

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

- Settings → Environments → `npm`. Optional: a required reviewer, so that a new version waits for a person.
- Settings → Actions → General: the actions of GitHub (`actions/checkout`, `actions/setup-node`) must be allowed.
