#!/bin/bash

echo "🔍 Checking remote branches that are NOT present locally..."

# Get remote-only branches
remote_only=$(comm -23 \
  <(git branch -r | sed 's/origin\///' | sort) \
  <(git branch | sed 's/* //g' | sort))

if [ -z "$remote_only" ]; then
  echo "✅ No remote-only branches found. Everything is clean!"
  exit 0
fi

echo "Found these remote-only branches:"
echo "$remote_only"
echo

# Loop through each branch and ask for confirmation
for branch in $remote_only; do
  read -p "❓ Delete remote branch '$branch'? (y/n): " confirm
  if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
    echo "🗑️ Deleting $branch..."
    git push origin --delete "$branch"
  else
    echo "⏭️ Skipped $branch."
  fi
done

# Clean up local references
echo
echo "🔄 Cleaning up local references..."
git fetch --prune

echo "✅ Done! Remote branches synced with local."
