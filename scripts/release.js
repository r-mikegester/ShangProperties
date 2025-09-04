#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

console.log('Preparing release...');

try {
  // Run standard-version to bump version and create changelog
  execSync('npx standard-version', { stdio: 'inherit' });
  
  console.log('Release prepared successfully!');
  console.log('Changes have been committed and tagged.');
  
  // Get the current branch name
  const branchName = execSync('git branch --show-current').toString().trim();
  console.log(`Current branch detected: ${branchName}`);
  
  // Automatically push changes and tags to GitHub
  console.log('Pushing changes and tags to GitHub...');
  execSync(`git push --follow-tags origin ${branchName}`, { stdio: 'inherit' });
  
  console.log('✅ Release successfully published to GitHub!');
  console.log(`You can view your release at: https://github.com/ShangProperties/ShangProperties/releases`);
} catch (error) {
  console.error('Error during release process:', error.message);
  console.log('\n📝 To manually push the release, run:');
  console.log('   git push --follow-tags origin main');
  process.exit(1);
}