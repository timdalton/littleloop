#!/bin/zsh
# prints worst white-text contrast over the sky for each forced hour at 1440 and 390
for h in 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 22 23; do
  bun $HOME/.claude/skills/Interceptor/Tools/VerifyViewport.ts probe "http://localhost:47312/?h=$h" --widths 1440,390 --expr @probe-contrast.js 2>&1 | grep -o 'worst[^,]*,[^,]*' | tr '\n' ' '; echo " <- h=$h"
done
