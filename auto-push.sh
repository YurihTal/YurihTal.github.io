#!/bin/bash
# Auto-push script

# Check if there are changes
if [[ -n $(git status --porcelain) ]]; then
    echo "Changes detected, committing and pushing..."
    git add .
    git commit -m "Auto-update: $(date)"
    git push origin main
    echo "Changes pushed successfully!"
else
    echo "No changes to commit."
fi