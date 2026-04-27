# Blog Stats System

## How It Works

The blog statistics (reads, likes, dislikes) are maintained in `blog-stats.json` which is:
- **Excluded from git** (via `.gitignore`)
- **Preserved during deployments** (downloaded from S3 before sync)
- **Loaded dynamically** by JavaScript on page load

## Stats Persistence

### Current Setup:
1. Stats are stored in `blog-stats.json` on S3
2. During deployment, the workflow:
   - Downloads existing `blog-stats.json` from S3
   - Syncs all files EXCEPT `blog-stats.json`
   - Uploads the stats file separately (preserving counters)

### Local Development:
- Stats are hardcoded in HTML for immediate display
- JavaScript loads from `blog-stats.json` if available
- Like/Dislike buttons update in-memory (not persisted locally)

## Deployment

### Using GitHub Actions (Automated):
```bash
git add .
git commit -m "Update blog content"
git push origin main
```
The workflow automatically preserves stats.

### Manual Deployment:
```bash
./deploy.sh
```
This script:
1. Downloads current stats from S3
2. Syncs files to S3
3. Uploads stats separately
4. Invalidates CloudFront cache

## Important Notes

⚠️ **Stats Limitations:**
- This is a **read-only** system for static sites
- Clicks on Like/Dislike buttons update display but don't persist
- For real-time updates, you need a backend API

## Future Improvements

For production-grade analytics, consider:
1. **AWS API Gateway + Lambda + DynamoDB** - Real-time stats
2. **Google Analytics** - Professional analytics
3. **Third-party services** - CountAPI, Firebase, etc.

## Files

- `blog-stats.json` - Stats data (gitignored)
- `blog-stats.js` - JavaScript to load/display stats
- `.gitignore` - Excludes stats from git
- `deploy.sh` - Manual deployment script
- `.github/workflows/deploy.yml` - Automated deployment
