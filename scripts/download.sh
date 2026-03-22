#!/bin/bash
# download.sh — Download orthodox.net content from the Inoa server via rsync
#
# Usage:
#   ./download.sh              # Download HTML, images, PDFs, docs (no large media)
#   ./download.sh --all        # Download everything including audio/video
#   ./download.sh --audio-only # Download only audio files (for a separate repo)
#   ./download.sh --dry-run    # Show what would be transferred without downloading
#
# rsync is incremental — safe to re-run to pick up changes.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.env"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: config.env not found."
    echo "Copy config.env.example to config.env and fill in your credentials:"
    echo "  cp config.env.example config.env"
    exit 1
fi

source "$CONFIG_FILE"

# Resolve LOCAL_PATH relative to script directory
if [[ "$LOCAL_PATH" != /* ]]; then
    LOCAL_PATH="$SCRIPT_DIR/$LOCAL_PATH"
fi

MODE="${1:---default}"
DRY_RUN=""

if [ "$MODE" = "--dry-run" ]; then
    DRY_RUN="--dry-run"
    MODE="--default"
    echo "=== DRY RUN — no files will be transferred ==="
    echo ""
fi

# Common rsync options
RSYNC_OPTS=(
    -avz
    --progress
    --stats
    -e "ssh -i ${SSH_KEY} -p ${SSH_PORT}"
    $DRY_RUN
)

case "$MODE" in
    --default)
        echo "Downloading HTML, images, PDFs, documents (excluding audio/video)..."
        echo "Source: ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"
        echo "Dest:   ${LOCAL_PATH}/"
        echo ""

        mkdir -p "$LOCAL_PATH"

        rsync "${RSYNC_OPTS[@]}" \
            --exclude='*.mp3' \
            --exclude='*.wav' \
            --exclude='*.wma' \
            --exclude='*.wmv' \
            --exclude='*.avi' \
            --exclude='*.mp4' \
            --exclude='*.flv' \
            --exclude='.well-known/' \
            --exclude='cgi-bin/' \
            --exclude='.cpanel/' \
            --exclude='.trash/' \
            --exclude='tmp/' \
            --exclude='logs/' \
            --exclude='error_log' \
            --exclude='.ftpquota' \
            --exclude='new/onet-v2/' \
            "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/" \
            "$LOCAL_PATH/"
        ;;

    --all)
        echo "Downloading ALL content (including audio/video)..."
        echo "Source: ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"
        echo "Dest:   ${LOCAL_PATH}/"
        echo ""

        mkdir -p "$LOCAL_PATH"

        rsync "${RSYNC_OPTS[@]}" \
            --exclude='.well-known/' \
            --exclude='cgi-bin/' \
            --exclude='.cpanel/' \
            --exclude='.trash/' \
            --exclude='tmp/' \
            --exclude='logs/' \
            --exclude='error_log' \
            --exclude='.ftpquota' \
            --exclude='new/onet-v2/' \
            "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/" \
            "$LOCAL_PATH/"
        ;;

    --audio-only)
        echo "Downloading audio files only (for separate audio archive repo)..."
        echo "Source: ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"
        echo "Dest:   ${LOCAL_PATH}/"
        echo ""

        mkdir -p "$LOCAL_PATH"

        rsync "${RSYNC_OPTS[@]}" \
            --include='*/' \
            --include='*.mp3' \
            --include='*.wav' \
            --include='*.wma' \
            --exclude='*' \
            --exclude='new/onet-v2/' \
            "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/" \
            "$LOCAL_PATH/"
        ;;

    *)
        echo "Usage: $0 [--all | --audio-only | --dry-run]"
        echo ""
        echo "  (no args)     Download HTML, images, PDFs, docs (skip audio/video)"
        echo "  --all         Download everything"
        echo "  --audio-only  Download only audio files"
        echo "  --dry-run     Preview what would be transferred (default mode)"
        exit 1
        ;;
esac

echo ""
echo "Download complete."
echo ""

# Post-download stats
if [ -z "$DRY_RUN" ]; then
    echo "--- Local archive stats ---"
    echo "Total size: $(du -sh "$LOCAL_PATH" | cut -f1)"
    echo "File count: $(find "$LOCAL_PATH" -type f | wc -l)"
    echo ""

    # Check for files over 100MB (GitHub limit)
    LARGE_FILES=$(find "$LOCAL_PATH" -type f -size +100M 2>/dev/null)
    if [ -n "$LARGE_FILES" ]; then
        echo "WARNING: Files over 100MB found (GitHub limit):"
        echo "$LARGE_FILES" | while read -r f; do
            ls -lh "$f"
        done
        echo ""
        echo "These will need Git LFS or should be excluded from the repo."
    fi
fi
