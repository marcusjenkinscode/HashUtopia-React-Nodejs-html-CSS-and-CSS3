#!/usr/bin/env bash
# deploy.sh — Update HashUtopia on an Ubuntu 24 nginx server
#
# Usage:
#   ./deploy.sh [options]
#
# Options:
#   -d <dir>    Repository directory (default: directory of this script)
#   -w <dir>    Nginx web root       (default: /var/www/html)
#   -b <branch> Git branch to pull   (default: main)
#   -h          Show this help message
#
# Requirements:
#   - git, node, npm installed
#   - The user running this script must have write access to <web-root>
#     and permission to reload nginx (e.g. via sudo/sudoers entry).

set -euo pipefail

# ── Defaults ────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$SCRIPT_DIR"
WEB_ROOT="/var/www/html"
BRANCH="main"
SUDO_CMD="sudo"

# ── Argument parsing ─────────────────────────────────────────────────────────
usage() {
  # Print only the leading comment block (lines 2–N until the first blank line)
  tail -n +2 "$0" | sed -n '/^#/{s/^# \{0,1\}//;p}; /^[^#]/q'
  exit 0
}

while getopts ":d:w:b:h" opt; do
  case "$opt" in
    d) REPO_DIR="$OPTARG" ;;
    w) WEB_ROOT="$OPTARG" ;;
    b) BRANCH="$OPTARG" ;;
    h) usage ;;
    :) echo "ERROR: Option -$OPTARG requires an argument." >&2; exit 1 ;;
    \?) echo "ERROR: Unknown option -$OPTARG." >&2; exit 1 ;;
  esac
done

# ── Helpers ──────────────────────────────────────────────────────────────────
log()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
err()  { log "ERROR: $*" >&2; exit 1; }
run_as_root() {
  if [[ -n "$SUDO_CMD" ]]; then
    "$SUDO_CMD" "$@"
  else
    "$@"
  fi
}

# ── Pre-flight checks ─────────────────────────────────────────────────────────
if [[ "$(id -u)" -eq 0 ]]; then
  SUDO_CMD=""
elif ! command -v sudo &>/dev/null; then
  err "'sudo' is required when not running as root."
fi

for cmd in git node npm rsync nginx systemctl; do
  command -v "$cmd" &>/dev/null || err "'$cmd' is not installed or not in PATH."
done

[[ -d "$REPO_DIR/.git" ]] || err "'$REPO_DIR' is not a git repository."

log "=== HashUtopia deployment started ==="
log "Repository : $REPO_DIR"
log "Web root   : $WEB_ROOT"
log "Branch     : $BRANCH"

# ── Step 1: Pull latest code ─────────────────────────────────────────────────
log "Fetching latest changes from origin/$BRANCH …"
cd "$REPO_DIR"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# ── Step 2: Install / update dependencies ────────────────────────────────────
log "Installing npm dependencies …"
npm ci --prefer-offline

# ── Step 3: Build the app ────────────────────────────────────────────────────
log "Building the application …"
npm run build          # produces dist/

# ── Step 4: Deploy to nginx web root ─────────────────────────────────────────
log "Syncing dist/ → $WEB_ROOT …"
if [[ ! -d "$WEB_ROOT" ]]; then
  log "Web root '$WEB_ROOT' does not exist — creating it (may require sudo)."
  run_as_root mkdir -p "$WEB_ROOT"
fi

run_as_root rsync -av --delete "$REPO_DIR/dist/" "$WEB_ROOT/"

# ── Step 5: Reload nginx ──────────────────────────────────────────────────────
log "Validating nginx configuration …"
run_as_root nginx -t

log "Reloading nginx …"
run_as_root systemctl reload nginx

log "=== Deployment complete! Site is live at $WEB_ROOT ==="
