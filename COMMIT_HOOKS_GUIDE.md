# Commit Hook Guidelines

This project uses commit hooks to enforce conventional commits with JIRA ticket integration. GitHub Actions also validate branch names and commit messages on pull requests.

## Setup

The hooks are automatically installed when you run:

```bash
npm install
```

If you need to manually install them:

```bash
npm run prepare
```

## Branch Naming Format

All branches must follow this format:

```
<type>/<JIRA-TICKET>-<short-summary>
```

### Valid types:

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation
- **style** - Formatting/styling
- **refactor** - Code refactoring
- **perf** - Performance improvement
- **test** - Testing
- **chore** - Maintenance/tooling
- **ci** - CI/CD configuration
- **revert** - Reverting changes

### Branch naming rules:

- Type must be lowercase
- JIRA ticket must be uppercase with hyphen and numbers (e.g., `PROJ-123`, `ABC-456`)
- Summary must be lowercase, hyphen-separated
- No underscores or spaces

### Examples:

**Valid branches:**

```
feat/PROJ-123-add-oauth
fix/ABC-456-button-alignment
docs/JIRA-789-update-api
refactor/PROJ-100-improve-auth
```

**Invalid branches (will fail on PR):**

```
feature/add-oauth                    # Wrong type, missing JIRA ticket
feat/proj-123-add-oauth              # JIRA ticket not uppercase
feat/PROJ-123_add_oauth              # Use hyphens not underscores
feat/PROJ-123/add-oauth              # Use hyphens not slashes
myfeature                            # Missing type and ticket
```

## Commit Message Format

All commits must follow this format:

```
<type>(<JIRA-TICKET>): <subject>

<body>

<footer>
```

### Components:

#### Type (required)

Must be one of:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, missing semicolons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding tests or updating existing tests
- **chore**: Changes to build process, dependencies, or tooling
- **ci**: Changes to CI/CD configuration
- **revert**: Reverting a previous commit

#### JIRA Ticket (required)

Must be a valid JIRA ticket identifier in the scope position (e.g., `PROJ-123`, `ABC-456`).
Format: uppercase letters (2+) followed by a hyphen and numbers.

#### Subject (required)

- Use imperative mood ("add" not "adds" or "added")
- Don't capitalize the first letter
- No period at the end
- Maximum 72 characters

#### Body (optional)

- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate from subject with a blank line

#### Footer (optional)

- Additional JIRA references
- Note breaking changes: `BREAKING CHANGE: description`

## Examples

### Good commits:

```
feat(PROJ-123): add OAuth2 integration

Implement OAuth2 authentication flow to support social login.
This change replaces the old JWT-only approach.

BREAKING CHANGE: JWT tokens are no longer accepted
```

```
fix(PROJ-456): fix button alignment on mobile

The button was positioned incorrectly on screens under 480px.
```

```
docs(PROJ-789): update API documentation
```

```
chore(ABC-134): update dependencies
```

### Invalid commits (will be rejected):

```
added new feature  # Missing type and JIRA ticket in scope
fix: bug fix  # Missing JIRA ticket in scope
feat(auth): my feature  # Scope must be JIRA ticket, not feature area
feat(proj-123): feature  # Must be uppercase (PROJ-123, not proj-123)
feat(PROJ-123) no colon description  # Invalid format
```

## Testing Commits Locally

Before pushing, you can validate your commit message:

```bash
# Lint your commit message
npx commitlint --from HEAD~1
```

## Bypassing Hooks (Not Recommended)

If absolutely necessary, you can bypass hooks:

```bash
git commit --no-verify
```

**However, this should only be used in exceptional circumstances and requires code review justification.**

## Troubleshooting

### Hook not running?

1. Ensure hooks are installed: `npm run prepare`
2. Check hook file permissions: `.husky/commit-msg` should be executable
3. On Windows with WSL: Ensure you're committing from the WSL terminal

### Commitlint not found?

1. Install dependencies: `npm install`
2. Restart your terminal
3. Try again: `npm run prepare`

## Configuration

The hook configuration is in [`commitlint.config.js`](./commitlint.config.js) and can be customized as needed.
