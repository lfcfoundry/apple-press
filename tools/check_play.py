#!/usr/bin/env python3
"""Fails when the live play page is older than what it is built from.

Copyright (c) 2026 LFC Foundry. MIT License.

Cheap check (git only, no build): the last commit that changed the sources must not be
newer than the last commit that changed play/index.html. If it is, the build was never
copied to the play page.  Run:  python3 tools/check_play.py
"""
import re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ["play"]
PLAY = "play/index.html"


def git(*a):
    return subprocess.run(["git", "-C", str(ROOT), *a], capture_output=True, text=True).stdout.strip()


def main():
    problems = []
    p, s = git("log", "-1", "--format=%H", "--", PLAY), git("log", "-1", "--format=%H", "--", *SRC)
    if not p:
        problems.append(PLAY + " has no commit yet")
    elif s and p != s and subprocess.run(["git", "-C", str(ROOT), "merge-base", "--is-ancestor", p, s]).returncode == 0:
        problems.append("%s (changed %s) is older than its sources (changed %s): copy the latest build to the play page"
                        % (PLAY, git("log", "-1", "--format=%cs %h", p), git("log", "-1", "--format=%cs %h", s)))
    top = re.search(r"build (\d{4}\.\d\d\.\d\d\.\d{4})", (ROOT / "changelog-dev.md").read_text(encoding="utf-8"))
    if top and top.group(1) not in (ROOT / PLAY).read_text(encoding="utf-8", errors="replace"):
        problems.append("%s does not carry the newest build in changelog-dev.md (%s)" % (PLAY, top.group(1)))
    for m in problems:
        print("STALE:", m)
    print("play page is current" if not problems else "play page is NOT current")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
