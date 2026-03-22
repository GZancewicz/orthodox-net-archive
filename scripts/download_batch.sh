#!/bin/bash
# download_batch.sh — Download folders from orthodox.net one at a time
#
# Usage:
#   ./download_batch.sh                    # Download all small folders (<1 MB)
#   ./download_batch.sh poetry prayers     # Download specific folders
#   ./download_batch.sh --medium           # Download medium folders (1-40 MB)
#   ./download_batch.sh --large            # Download large folders (>40 MB)
#   ./download_batch.sh --all              # Download everything (except skipped)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ARCHIVE_DIR="$SCRIPT_DIR/../archive/public_html"
BASE_URL="https://www.orthodox.net/archive_folder.php"

# Folders to always skip
SKIP="audio homilies local-media new"

SMALL_FOLDERS="legacy.orthodox.net prisonministry templates 6minutesorlessorthodoxvideos a-word-from-the-pastor bak bulletin goodtoknow a-fathers-letters appeals charities churchyear doyouhaveaminute apostol conversions hm banners guestbook last-upload.all dyptichs falbum includes memorization menaion-thoughts documents pilot referenc redeemingthetime.backup tidy talks synaxarion search september-11-2001 roc poetry prayers moleben monastic-stories troparia theophany topics newsletter holiness-happens holyweek menu microbiology misc js graphics ecumenism exact cotc western-saints faq fathers sermon-notes links directory recipes slicebox osb rubrics tothinkabout 10things a-little-bit"

MEDIUM_FOLDERS="menaion-february menaion-april menaion-may menaion-march menaion-june menaion-july menaion-august menaion-october menaion-september menaion-november menaion-december menaion-january menaion music nativity dailylent questions2 whatsnew news sermons-index podcasts ustav quiz questions2 redeeming announcements data calendar slides-slidesjs-3 letters scripture-memory pascha stnicholas russiannm prologue questions onet articles images greatlent confess private_ church-school forms docs church-school ministries bulletin wpt-3 redeemingthetime scripture"

LARGE_FOLDERS="catechism daniel aboutus full-voice trebnic akathists services prison-ministry ikons journal sermons photos"

download_folder() {
    local folder=$1

    # Check if already downloaded (has files beyond README.md)
    local file_count=$(find "$ARCHIVE_DIR/$folder" -type f ! -name "README.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$file_count" -gt 0 ]; then
        echo "SKIP: $folder (already has $file_count files)"
        return
    fi

    echo -n "Downloading $folder... "
    local tmpfile="/tmp/orthodox_${folder}.zip"

    local http_code
    http_code=$(curl -sL -o "$tmpfile" -w "%{http_code}" --max-time 300 "${BASE_URL}?folder=${folder}")

    local size
    size=$(wc -c < "$tmpfile" | tr -d ' ')

    if [ "$http_code" = "200" ] && [ "$size" -gt 100 ]; then
        unzip -qo "$tmpfile" -d "$ARCHIVE_DIR/" 2>/dev/null
        local extracted=$(find "$ARCHIVE_DIR/$folder" -type f ! -name "README.md" | wc -l | tr -d ' ')
        echo "OK — $extracted files extracted ($(echo "scale=1; $size/1024" | bc) KB)"
        rm -f "$tmpfile"
    else
        echo "FAIL (HTTP $http_code, $size bytes)"
        rm -f "$tmpfile"
        return 1
    fi
}

# Determine which folders to download
FOLDERS=""
case "${1:---small}" in
    --small)
        echo "=== Downloading small folders (<1 MB) ==="
        FOLDERS="$SMALL_FOLDERS"
        ;;
    --medium)
        echo "=== Downloading medium folders (1-40 MB) ==="
        FOLDERS="$MEDIUM_FOLDERS"
        ;;
    --large)
        echo "=== Downloading large folders (>40 MB) ==="
        FOLDERS="$LARGE_FOLDERS"
        ;;
    --all)
        echo "=== Downloading all folders ==="
        FOLDERS="$SMALL_FOLDERS $MEDIUM_FOLDERS $LARGE_FOLDERS"
        ;;
    *)
        # Specific folders passed as arguments
        FOLDERS="$*"
        ;;
esac

SUCCESS=0
FAIL=0
SKIPPED=0

for folder in $FOLDERS; do
    # Check skip list
    if echo "$SKIP" | grep -qw "$folder"; then
        echo "SKIP: $folder (in skip list)"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    if download_folder "$folder"; then
        SUCCESS=$((SUCCESS + 1))
    else
        FAIL=$((FAIL + 1))
    fi
done

echo ""
echo "=== Done: $SUCCESS downloaded, $SKIPPED skipped, $FAIL failed ==="
