---
name: add-role
description: Interview the user about one past job and write a structured role file to roles/. Use when the user wants to add, capture, record, or document a previous role, job, position, or employer for their CV, or says "add a role" / "add-role".
---

# Add a role

Captures one past role as a structured file that a later tailoring step can
select from. The role file is a **superset** of any single CV - capture more
detail than would ever fit on one page.

## Non-negotiable rules

1. **Never invent a detail.** Not a number, not a date, not a job title. A
   fabricated metric survives until an interviewer asks about it, then destroys
   the candidacy. This rule outranks producing a good-looking file. If the user
   can't recall a figure, **omit the line entirely** - no `unverified`
   placeholder. The file is a statement of what happened, not a form with gaps
   in it. Where a claim invites a figure that doesn't exist - "reduced costs",
   say - add a plain note that the figure is not available, and list the
   unavailable ones once at the end of the file so nobody re-asks.
2. **Separate "I" from "we".** For every achievement, establish what the user
   personally did versus what their team did. Record both in `contribution:`.
   Unattributed team wins are the most common way a CV becomes indefensible.
3. **Salary and reasons for leaving never enter this repo.** Not in a role file,
   not in a gitignored sidecar, not in a commit message, not in passing in a
   heading. Do not ask about them. If the user volunteers either, do not write
   it down - say where it can live instead (see Boundary below).
4. **One question at a time.** The waves in QUESTIONS.md are checklists of what
   to cover, not messages to send. A five-bullet message gets two bullets
   answered. Ask, listen, follow up on what's interesting, then move on.
5. **Take "skip" for an answer.** One skip ends a question, two in a row end
   that line of enquiry, and a mostly-skipped wave means offering to stop and
   resume later. Interrogating someone about their own career is the fastest
   way to ensure they never run this skill again.
6. **Write as the source of truth.** The role file states what happened; it
   never annotates or corrects some other document. Never write "the current CV
   says" or "correction to the CV" - an existing CV may be a useful prompt
   during the interview, but it has no standing here and will be gone in a year.
7. **Write for the same audience as the CV.** The repo is public: assume the
   recruiter or hiring manager receiving the generated CV also reads the role
   file behind it. So no notes coaching on what to conceal ("do not claim...",
   "never mention...", "indefensible") and no talking the work down ("the
   shortest role", "the most junior title", "explains the gap"). Both read as a
   candidate managing what they can get away with. State the fact precisely and
   the wrong claim becomes impossible on its own: *"the decision was taken
   before I became technical lead; I led the implementation"* does everything
   "do not claim the call" was for. Where something was never established,
   leave it out - don't write a note about leaving it out.

## Boundary

**One file per role, and everything in it is publishable.** The repo is public;
treat every file as though it is already on the internet, because a gitignore is
a convenience and not a security boundary - one `git add -f`, or one edit to
`.gitignore`, and an "ignored" file is in the permanent history.

So the test for anything the interview turns up is simply: *would I be content
for a recruiter to read this?* If no, it does not get written to disk here.

Never in this repo:

- Salary, day rate, equity, or any compensation figure
- Why the user left a role
- Named criticism of former employers, managers, or colleagues
- Anything told to you in confidence about a previous employer

There is no private-file mechanism here, by design. Do not invent one, do not
propose a gitignored sidecar, and do not offer to stash candid notes somewhere
else in the repo. If the interview surfaces something unpublishable, let it stay
in the conversation and out of the filesystem.

Role files are `roles/<start-year>-<company>-<title>.md`, lowercase and
hyphenated, e.g. `roles/2021-acme-platform-lead.md`.

## Process

1. **Check for an existing file** for that company before starting - if one
   exists, offer to extend it rather than duplicating.
2. **Run the interview** - five waves, in order. The full question bank with
   follow-up prompts is in [QUESTIONS.md](QUESTIONS.md). Use `AskUserQuestion`
   for closed questions (employment type, remote/onsite, seniority) and plain
   conversation for open ones (achievements, context) - options boxes are a bad
   fit for "tell me what you actually built".
3. **Chase every achievement for a number.** Wave 3 is the point of the whole
   exercise; the other five waves are scaffolding. Ask "how much / how many /
   how long / compared to what". Accept "I don't know" on the second ask, leave
   the figure out, and keep going.
4. **Write the role file** using [TEMPLATE.md](TEMPLATE.md) as the skeleton.
5. **Read the result back** - show the user the achievement headlines only, not
   the whole file, and ask what's wrong or missing. People remember their best
   work about ten minutes after they stop being asked about it.
6. **Offer to commit.** Before doing so, re-read the file once against the
   Boundary above - the interview is discursive and it is easy to let a candid
   aside end up on disk.

## Tagging for later tailoring

Every achievement gets inline tags (`` `#devops` ``) and an `Emphasise for:`
line naming the kinds of target role it supports. These are what the tailoring
step filters on, so be generous - an untagged achievement is invisible to it.

Prefer a small stable vocabulary over inventing tags per role. Check the tags
already used across `roles/*.md` before adding a new one.
