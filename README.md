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

## Deployment
### Cloudflare Pages
1. In Cloudflare dashboard, set up a new Pages project
2. Connect to your Git repository
3. Configure with these build settings:
   - Framework preset: None
   - Build command: `npx quartz build`
   - Build output directory: `public`
   - Deploy command: Leave blank or use `echo "Deployment complete"` 
   
   > If "Deploy command" is a required field, using a simple echo command is better than using wrangler, as wrangler expects a file entry point, not a directory.

> **Note**: Don't use `npx wrangler deploy public` as a deploy command when deploying to Cloudflare Pages. Pages automatically deploys the static files from the build output directory.

### Cloudflare Pages with Wrangler
1. In Cloudflare dashboard, set up a new Pages project
2. Connect to your Git repository
3. Configure with these build settings:
   - Framework preset: None
   - Build command: `npx quartz build`
   - Build output directory: `public`
   - Deploy command: `npx wrangler pages deploy public`

> **Note**: When using Wrangler with Pages, use `wrangler pages deploy` instead of `wrangler deploy` to deploy static sites. The `pages deploy` command is specifically designed for deploying static sites to Cloudflare Pages.

### Manual Deployment with Wrangler
Alternatively, you can deploy manually by running:
```bash
npx quartz build
npx wrangler pages deploy public
```