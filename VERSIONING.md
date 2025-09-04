# Versioning System

This project uses semantic versioning with automated changelog generation.

## How it works

When you want to create a new release, the system will:
1. Automatically increment the version number in [package.json](file:///C:/Users/user/OneDrive/Documents/GitHub/Repositories/ShangProperties/package.json)
2. Generate/update [CHANGELOG.md](file:///C:/Users/user/OneDrive/Documents/GitHub/Repositories/ShangProperties/CHANGELOG.md) based on commit messages
3. Create a new commit with the version bump
4. Create a git tag for the new version
5. Automatically push changes and tags to GitHub

## Setup

The versioning system has been set up with the following tools:
- `standard-version`: For automatic versioning and changelog generation
- `husky`: For git hook management

These were installed as dev dependencies when you ran `npm install`.

## Usage

To create a new release, run one of these commands:

```bash
# Create a new release with automatic version bumping based on commit types
npm run release

# Create a new release with specific version bump types:
npm run release:patch  # For bug fixes (3.0.1 -> 3.0.2)
npm run release:minor  # For new features (3.0.1 -> 3.1.0)
npm run release:major  # For breaking changes (3.0.1 -> 4.0.0)
```

## Commit Message Format

For automatic versioning to work effectively, use conventional commit messages:

- `feat: ...` - for new features (will trigger minor version bump)
- `fix: ...` - for bug fixes (will trigger patch version bump)
- `BREAKING CHANGE: ...` - for breaking changes (will trigger major version bump)

Other commit types like `docs:`, `chore:`, `style:`, etc. won't trigger version bumps but will be included in the changelog.

Example commit messages:
```
feat: add new contact form component
fix: resolve image loading issue in gallery
BREAKING CHANGE: rename getAllProjects to fetchProjects
```

## Automatic Push to GitHub

After creating a release, the system will automatically push the changes and tags to GitHub. This eliminates the need to manually run `git push --follow-tags origin main`.

If the automatic push fails for any reason (e.g., authentication issues), you'll see an error message with instructions on how to manually push the changes.

## Manual Versioning

If you prefer to manually control versioning, you can:

1. Update the version in [package.json](file:///C:/Users/user/OneDrive/Documents/GitHub/Repositories/ShangProperties/package.json) directly
2. Run `npx standard-version --skip.bump --skip.tag` to generate changelog based on commits since last release

## Troubleshooting

If you encounter issues with the release process:

1. Make sure you have all the required dependencies installed:
   ```bash
   npm install --save-dev standard-version husky
   ```

2. Ensure husky is properly set up:
   ```bash
   npm run prepare
   ```

3. Check that you have at least one commit since the last release

4. If there are conflicts with the changelog, you may need to resolve them manually

5. If automatic push fails, you can manually push with:
   ```bash
   git push --follow-tags origin main
   ```

## GitHub Actions Integration (Optional)

If you want to automate this process further, you can set up GitHub Actions to automatically create releases when you push to specific branches.