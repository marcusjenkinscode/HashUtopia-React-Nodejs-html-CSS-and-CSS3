#!/usr/bin/env bash
# deploy.sh — Install / update HashUtopia on an Ubuntu 24 nginx server
#
# Usage:
#   ./deploy.sh [options]
#
# Options:
#   -r <url>    GitHub repository URL to clone (required on first run)
#   -d <dir>    Local repository directory     (default: /opt/hashutopia)
#   -w <dir>    Nginx web root                 (default: /var/www/hashutopia)
#   -s <name>   Nginx server_name / hostname   (default: _)
#   -b <branch> Git branch to deploy           (default: main)
#   -h          Show this help message
#
# What this script does:
#   1. Clones the repository from GitHub (first run) or pulls the latest
#      changes (subsequent runs).
#   2. Installs / updates npm dependencies.
#   3. Builds the React application (produces dist/).
#   4. Syncs the build output to the nginx web root.
#   5. Writes an nginx site configuration that serves the SPA correctly
#      (all unknown paths fall back to index.html for client-side routing).
#   6. Enables the site and reloads nginx.
#
# Requirements:
#   - git, node, npm, rsync, nginx, systemctl must be installed.
#   - The user running this script must be able to use sudo (or run as root).

set -euo pipefail

# ── Defaults ─────────────────────────────────────────────────────────────────
REPO_URL=""
REPO_DIR="/opt/hashutopia"
WEB_ROOT="/var/www/hashutopia"
SERVER_NAME="_"
BRANCH="main"
SUDO_CMD="sudo"
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
SITE_NAME="hashutopia"

# ── Argument parsing ──────────────────────────────────────────────────────────
usage() {
  tail -n +2 "$0" | sed -n '/^#/{s/^# \{0,1\}//;p}; /^[^#]/q'
  exit 0
}

while getopts ":r:d:w:s:b:h" opt; do
  case "$opt" in
    r) REPO_URL="$OPTARG" ;;
    d) REPO_DIR="$OPTARG" ;;
    w) WEB_ROOT="$OPTARG" ;;
    s) SERVER_NAME="$OPTARG" ;;
    b) BRANCH="$OPTARG" ;;
    h) usage ;;
    :) echo "ERROR: Option -$OPTARG requires an argument." >&2; exit 1 ;;
    \?) echo "ERROR: Unknown option -$OPTARG." >&2; exit 1 ;;
  esac
done

# ── Helpers ───────────────────────────────────────────────────────────────────
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

log "=== HashUtopia deployment started ==="
log "Repository : $REPO_DIR"
log "Web root   : $WEB_ROOT"
log "Branch     : $BRANCH"

# ── Step 1: Clone or update the repository from GitHub ───────────────────────
if [[ -d "$REPO_DIR/.git" ]]; then
  log "Repository already exists — pulling latest changes from origin/$BRANCH …"
  cd "$REPO_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  [[ -n "$REPO_URL" ]] || err "No local repository found at '$REPO_DIR'. Provide the GitHub URL with -r <url> to clone it on first run."
  log "Cloning $REPO_URL (branch: $BRANCH) → $REPO_DIR …"
  run_as_root mkdir -p "$(dirname "$REPO_DIR")"
  git clone --branch "$BRANCH" "$REPO_URL" "$REPO_DIR"
  cd "$REPO_DIR"
fi

# ── Step 2: Install / update dependencies ────────────────────────────────────
log "Installing npm dependencies …"
npm ci --prefer-offline

# ── Step 3: Build the application ────────────────────────────────────────────
log "Building the application …"
npm run build          # produces dist/

# ── Step 4: Sync build output to the nginx web root ──────────────────────────
log "Syncing dist/ → $WEB_ROOT …"
run_as_root mkdir -p "$WEB_ROOT"
run_as_root rsync -av --delete "$REPO_DIR/dist/" "$WEB_ROOT/"

# ── Step 5: Write nginx site configuration ────────────────────────────────────
NGINX_CONF="$NGINX_CONF_DIR/$SITE_NAME"

log "Writing nginx configuration → $NGINX_CONF …"
run_as_root tee "$NGINX_CONF" > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAME;

    root $WEB_ROOT;
    index index.html;

    # Serve static assets with long-lived cache headers
    location ~* \\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    # All other requests fall back to index.html (client-side routing)
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# ── Step 6: Enable the site and reload nginx ──────────────────────────────────
NGINX_ENABLED_LINK="$NGINX_ENABLED_DIR/$SITE_NAME"
if [[ ! -L "$NGINX_ENABLED_LINK" ]]; then
  log "Enabling site …"
  run_as_root ln -sf "$NGINX_CONF" "$NGINX_ENABLED_LINK"
fi

log "Validating nginx configuration …"
run_as_root nginx -t

log "Reloading nginx …"
run_as_root systemctl reload nginx

log "=== Deployment complete! Site is live at $WEB_ROOT (server_name: $SERVER_NAME) ==="
