#!/usr/bin/env bash
# Verify the Caddy cache/fallback behaviour from issue #79.
#
# Usage:
#   scripts/check-cache-headers.sh [BASE_URL]      (default: https://askansari.ai)
#
# Checks:
#   - /                      -> 200 text/html, Cache-Control: no-cache
#   - /chat/<id> deep link   -> 200 text/html, Cache-Control: no-cache
#   - current entry bundle   -> 200 javascript, Cache-Control immutable + 1y max-age
#   - nonexistent bundle     -> 404, not text/html, no immutable cache header
set -u

BASE="${1:-https://askansari.ai}"
BASE="${BASE%/}"
fail=0

headers() { curl -sSI "$1"; }
field() { printf '%s\n' "$1" | awk -v k="$2" 'tolower($1)==tolower(k)":" { sub(/^[^:]+:[[:space:]]*/, ""); sub(/\r$/, ""); print; exit }'; }
status() { printf '%s\n' "$1" | awk 'NR==1 { print $2 }'; }

check() {
  local label="$1" ok="$2" detail="$3"
  if [ "$ok" = 1 ]; then
    echo "PASS  $label"
  else
    echo "FAIL  $label  ($detail)"
    fail=1
  fi
}

# Root: SPA HTML, must revalidate.
h=$(headers "$BASE/")
check "GET / is 200 HTML" "$( [ "$(status "$h")" = 200 ] && [[ "$(field "$h" content-type)" == text/html* ]] && echo 1 || echo 0 )" "$(status "$h") $(field "$h" content-type)"
check "GET / has Cache-Control: no-cache" "$( [ "$(field "$h" cache-control)" = "no-cache" ] && echo 1 || echo 0 )" "cache-control='$(field "$h" cache-control)'"

# Deep link: SPA fallback still works.
h=$(headers "$BASE/chat/issue-79-deep-link")
check "GET /chat/<id> is 200 HTML" "$( [ "$(status "$h")" = 200 ] && [[ "$(field "$h" content-type)" == text/html* ]] && echo 1 || echo 0 )" "$(status "$h") $(field "$h" content-type)"
check "GET /chat/<id> has Cache-Control: no-cache" "$( [ "$(field "$h" cache-control)" = "no-cache" ] && echo 1 || echo 0 )" "cache-control='$(field "$h" cache-control)'"

# Current bundle: discover it from index.html, expect immutable caching.
entry=$(curl -sS "$BASE/" | grep -oE '/_expo/static/js/web/entry-[A-Za-z0-9]+\.js' | head -1)
if [ -z "$entry" ]; then
  check "discover entry bundle from index.html" 0 "no /_expo/static/js/web/entry-*.js in HTML"
else
  h=$(headers "$BASE$entry")
  cc=$(field "$h" cache-control)
  check "GET $entry is 200 JS" "$( [ "$(status "$h")" = 200 ] && [[ "$(field "$h" content-type)" == *javascript* ]] && echo 1 || echo 0 )" "$(status "$h") $(field "$h" content-type)"
  check "GET $entry is immutable, max-age=31536000" "$( [[ "$cc" == *immutable* && "$cc" == *max-age=31536000* ]] && echo 1 || echo 0 )" "cache-control='$cc'"
fi

# Stale bundle from an old deploy: must 404, must not be HTML, must not be cached forever.
h=$(headers "$BASE/_expo/static/js/web/entry-00000000000000000000000000000000.js")
cc=$(field "$h" cache-control)
check "GET nonexistent entry bundle is 404" "$( [ "$(status "$h")" = 404 ] && echo 1 || echo 0 )" "status=$(status "$h")"
check "GET nonexistent entry bundle is not HTML" "$( [[ "$(field "$h" content-type)" != text/html* ]] && echo 1 || echo 0 )" "content-type='$(field "$h" content-type)'"
check "GET nonexistent entry bundle is not immutable" "$( [[ "$cc" != *immutable* ]] && echo 1 || echo 0 )" "cache-control='$cc'"

# Same for /assets/*.
h=$(headers "$BASE/assets/does-not-exist.00000000.png")
check "GET nonexistent /assets file is 404" "$( [ "$(status "$h")" = 404 ] && echo 1 || echo 0 )" "status=$(status "$h")"

exit $fail
