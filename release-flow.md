# 🚀 Release Flow Guide: Development → Preview → Main

This document outlines the steps to push new updates through a structured Git pipeline using Git + GitHub Desktop + npm. for staging changes and releasing stable versions with tags.

---

## 🧑‍💻 1. Commit Your Work in Development

```bash
git checkout development         # Switch to dev branch
git add .                        # Stage all changes
git commit -m "feat: add new component"  # Use clear, conventional messages
git push origin development      # Push work to remote


git checkout preview             # Move to preview branch
git pull origin preview          # Ensure latest preview updates
git merge development            # Bring changes from development
# Resolve any conflicts if necessary
git add .
git commit -m "merge development into preview"
git push origin preview

npm version major                # Updates package.json & creates Git tag
# or use:
npm version minor
npm version patch

git push origin preview --follow-tags

git checkout main
git pull origin main
git merge preview
# Again, resolve any conflicts if needed
git add .
git commit -m "release: version x.x.x - merge preview into main"
git push origin main --follow-tags
