#!/bin/bash

# Deployment script that preserves blog stats

echo "Starting deployment..."

# Download current stats from S3 before deploying
echo "Downloading current stats from S3..."
aws s3 cp s3://blogs.suhebghare.tech/blog-stats.json ./blog-stats.json --region us-east-1 || echo "No existing stats found, using local version"

# Sync files to S3 (excluding stats)
echo "Syncing files to S3..."
aws s3 sync . s3://blogs.suhebghare.tech \
  --exclude ".git/*" \
  --exclude ".github/*" \
  --exclude "README.md" \
  --exclude "deploy.sh" \
  --exclude "bucket-policy.json" \
  --delete \
  --region us-east-1

# Upload stats file separately (won't be deleted)
echo "Uploading stats file..."
aws s3 cp ./blog-stats.json s3://blogs.suhebghare.tech/blog-stats.json --region us-east-1

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
  --paths "/*"

echo "Deployment complete!"
