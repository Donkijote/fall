#!/opt/homebrew/bin/bash
set -euo pipefail
# ghi-pr: Create a branch and draft PR from a GitHub issue
#
# Usage:
#   ghi-pr <issue-number> [--base <branch>]
#
# Examples:
#   ghi-pr 123
#   ghi-pr 123 --base main
#
# Effects:
#   - Creates/switches to branch: <kind>/ghi#<issue>
#   - Pushes branch if remote doesn't exist
#   - Creates draft PR: "[GHI#<issue>] <issue title>" → <base>
#   - PR inherits issue labels and is assigned to its creator
#   - Closes the issue on merge when the base is the default branch

ghi-pr() {

  if [[ $# -lt 1 ]]; then
    echo "Usage: ghi-pr <issue-number> [--base <branch>]" >&2
    return 2
  fi

  local issue="" base="develop"

  # Parse args
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --base)
        base="$2"; shift 2;;
      -*)
        echo "Unknown option: $1" >&2; return 2;;
      *)
        issue="${1#\#}"; shift;;
    esac
  done

  if [[ -z "$issue" ]]; then
    echo "X Missing issue number"; return 2
  fi

  echo "Fetching issue #${issue}..."
  local title body
  title="$(gh issue view "$issue" --json title --jq .title)"
  body="$(gh issue view "$issue"  --json body  --jq .body)"

  # Collect labels and require one unambiguous branch type.
  # Bash 3.2-compatible label collection
  local labels=() labels_output l
  labels_output="$(gh issue view "$issue" --json labels --jq '.labels[].name' || true)"
  while IFS= read -r l; do
    [[ -n "$l" ]] && labels+=("$l")
  done <<< "$labels_output"

  local kind_label="" kind_prefix=""

  for l in "${labels[@]:-}"; do
    if [[ "$l" == kind/* ]]; then
      if [[ -n "$kind_label" ]]; then
        echo "Multiple kind/* labels found; resolve the issue type first." >&2
        return 2
      fi
      kind_label="$l"
    fi
  done

  if [[ -z "$kind_label" ]]; then
    echo "Missing kind/* label; set the issue type before creating a branch." >&2
    return 2
  fi
  kind_prefix="${kind_label#kind/}" # 'kind/feature' → 'feature'

  local creator default_branch
  creator="$(gh api user --jq .login)"
  default_branch="$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name)"
  if [[ "$base" != "$default_branch" ]]; then
    echo "Note: Closes #${issue} only auto-closes on merge into ${default_branch}, not ${base}." >&2
  fi

  local branch="${kind_prefix}/ghi#${issue}"
  echo "Using branch: $branch (base: $base)"

  # Create/switch branch
  if git rev-parse --verify --quiet "$branch" >/dev/null; then
    git checkout "$branch"
  else
    git checkout -b "$branch"
  fi

  # Ensure there is at least one commit ahead of base
  git fetch origin "${base}" >/dev/null 2>&1 || true
  ahead_count="$(git rev-list --count "origin/${base}..${branch}" || echo 0)"
  if [ "${ahead_count}" -eq 0 ]; then
    echo "No commits ahead of ${base}; creating an empty bootstrap commit."
    git commit --allow-empty -m "chore: initial PR commit for #${issue}"
  fi

  # Auto-push branch if not on remote
  if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
    echo "Remote branch 'origin/$branch' already exists."
  else
    echo "Pushing new branch to origin/$branch..."
    git push -u origin "$branch"
  fi

  # Build label flags
  local label_flags=()
  for l in "${labels[@]:-}"; do
    label_flags+=(--label "$l")
  done

  local pr_title="[GHI#$issue] $title"
  echo "🚀 Creating DRAFT PR: \"$pr_title\" ($branch → $base)"

  local body_file create_status=0
  body_file="$(mktemp)"
  printf '%s\n\nCloses #%s\n' "$body" "$issue" > "$body_file"
  gh pr create \
    --draft \
    --title "$pr_title" \
    --body-file "$body_file" \
    --assignee "$creator" \
    --base "$base" \
    --head "$branch" \
    "${label_flags[@]}" || create_status=$?
  rm -f "$body_file"
  if [[ "$create_status" -ne 0 ]]; then
    return "$create_status"
  fi

  echo "Done! Branch '$branch' and draft PR created."
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  ghi-pr "$@"
fi
