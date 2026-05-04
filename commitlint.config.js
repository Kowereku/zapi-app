/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      noteKeywords: ["BREAKING CHANGE", "BREAKING-CHANGE"],
    },
  },
  plugins: [
    {
      rules: {
        "jira-in-scope": (parsed) => {
          const { scope } = parsed;
          const jiraPattern = /^[A-Z]{2,}-\d+$/;

          if (!scope) {
            return [false, "Scope must contain a JIRA ticket (e.g., PROJ-123)"];
          }

          if (!jiraPattern.test(scope)) {
            return [
              false,
              `Scope must be a valid JIRA ticket format (e.g., PROJ-123), got: ${scope}`,
            ];
          }

          return [true];
        },
      },
    },
  ],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "ci",
        "revert",
      ],
    ],
    "type-case": [2, "always", "lowercase"],
    "type-empty": [2, "never"],
    "scope-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
    "jira-in-scope": [2, "always"],
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],
  },
};
