# House-rule git hooks

Two small scripts that Git runs by itself on every commit in this repository. `commit-msg` checks the commit message and the author; `pre-commit` checks the author and warns about British spellings in the lines being added. Git does not copy hooks when it clones a repository, so they live in a tracked folder and are turned on once per clone:

    sh tools/hooks/install.sh

## Why they exist

The owner had to repeat these rules over and over; a hook checks them every time. Claude Code's own commit reminder asks for a session line, and this hook is what stops it.

## What each hook does

- `commit-msg` blocks a commit whose message has a `Claude-Session:` line or a claude.ai link, or whose author or committer is not `JNFoo <45110762+JNFoo@users.noreply.github.com>`. A `Co-Authored-By` trailer is fine.
- `pre-commit` blocks the wrong author or committer early, and warns (never blocks) about British spellings in added lines. Put `spelling-ok` on a line to silence it.

Copyright (c) 2026 LFC Foundry. MIT License (see `LICENSE` at the top of the repository).
