## Setup process
```
git clone https://github.com/jackyzha0/quartz.git
cd quartz
git checkout v4  # Switch to the v4 branch
git branch -m main v4  # Rename the local main branch to v4 (optional)
git branch --set-upstream-to=origin/v4 v4  # Set upstream to track origin/v4
npm i
npx quartz create
```
> during `npx quartz create`, empty quartz and treat links as shortest path

## Notes for self
Website analytics thru google analytics

The content folder is an obsidian vault.

Info about using quartz placed in content/private folder.

There are
- templates
- frontmatter info

## Syncing
`npx quartz sync` to push to github
