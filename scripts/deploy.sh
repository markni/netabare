sleep 1
grep_output=$(gh run list --json databaseId)
id=$(grep -o -E -m 1 '[0-9]+' <<< "$grep_output" | head -1  )
gh run watch $id