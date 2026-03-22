#!/bin/bash
# inventory.sh — SSH into the Inoa server and report content sizes
# Usage: ./inventory.sh
#
# Produces a report of:
#   1. Size of each top-level directory in public_html
#   2. File counts and total size by extension
#   3. Total size of public_html
#
# Output is saved to inventory_report.txt

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

REPORT_FILE="$SCRIPT_DIR/inventory_report.txt"

echo "Connecting to $SSH_USER@$SSH_HOST to inventory $REMOTE_PATH ..."
echo ""

ssh -i "${SSH_KEY}" -p "${SSH_PORT}" "${SSH_USER}@${SSH_HOST}" bash <<'REMOTE_SCRIPT' > "$REPORT_FILE"
REMOTE_PATH="$HOME/public_html"

echo "============================================"
echo "orthodox.net Server Inventory Report"
echo "Date: $(date)"
echo "Host: $(hostname)"
echo "Path: $REMOTE_PATH"
echo "============================================"
echo ""

# Total size
echo "--- TOTAL SIZE ---"
du -sh "$REMOTE_PATH" 2>/dev/null
echo ""

# Top-level directory sizes (sorted by size, largest first)
echo "--- DIRECTORY SIZES (top-level) ---"
du -sh "$REMOTE_PATH"/*/ 2>/dev/null | sort -rh
echo ""

# Also show the size of files directly in public_html (not in subdirectories)
echo "--- FILES IN ROOT (not in subdirectories) ---"
find "$REMOTE_PATH" -maxdepth 1 -type f -exec du -ch {} + 2>/dev/null | tail -1
echo ""

# File counts by extension (top 30)
echo "--- FILE COUNTS BY EXTENSION (top 30) ---"
find "$REMOTE_PATH" -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -30
echo ""

# Size by extension (top 20 largest)
echo "--- TOTAL SIZE BY EXTENSION (top 20) ---"
find "$REMOTE_PATH" -type f -printf '%f %s\n' 2>/dev/null | \
    awk -F. '{ext=tolower($NF); size=$NF; split($0,a," "); sizes[ext]+=a[2]; counts[ext]++} END {for(e in sizes) printf "%10.2f MB  %6d files  .%s\n", sizes[e]/1048576, counts[e], e}' | \
    sort -rn | head -20
echo ""

# Count of files over 100MB (GitHub limit)
echo "--- FILES OVER 100MB (GitHub limit) ---"
find "$REMOTE_PATH" -type f -size +100M -exec ls -lh {} \; 2>/dev/null
LARGE_COUNT=$(find "$REMOTE_PATH" -type f -size +100M 2>/dev/null | wc -l)
echo "Total files over 100MB: $LARGE_COUNT"
echo ""

# Total file count
echo "--- TOTAL FILE COUNT ---"
find "$REMOTE_PATH" -type f 2>/dev/null | wc -l
echo ""

echo "============================================"
echo "End of report"
echo "============================================"
REMOTE_SCRIPT

echo ""
echo "Report saved to: $REPORT_FILE"
echo ""
echo "--- Report Preview ---"
cat "$REPORT_FILE"
