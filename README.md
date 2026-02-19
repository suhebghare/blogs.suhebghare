# Tech Blog - blogs.suhebghare.tech

A static website for tech blogging focused on DevOps, SRE, and cloud infrastructure topics.

## Blog Topics

1. **Observability & Monitoring** - Setting up Grafana and monitoring platforms for uptime
2. **Kubernetes Guide** - Why K8s matters and how it's transforming infrastructure
3. **Infrastructure as Code** - Terraform and Ansible for modern infrastructure management
4. **Linux Server Management** - How Linux revolutionized server-side computing
5. **Security Best Practices** - Protecting web apps, backend services, and mitigation strategies
6. **DevOps Automation & CI/CD** - Building robust CI/CD pipelines and deployment automation
7. **Cloud Cost Optimization** - Strategies to reduce cloud spending without compromising performance
8. **Incident Response & Postmortems** - Building effective incident response processes

## Deployment to AWS S3 + CloudFront

### Prerequisites

- AWS CLI installed and configured
- AWS account with appropriate permissions
- Domain name configured (blogs.suhebghare.tech)

### Step 1: Create S3 Bucket

```bash
# Create S3 bucket
aws s3 mb s3://blogs.suhebghare.tech --region us-east-1

# Enable static website hosting
aws s3 website s3://blogs.suhebghare.tech \
  --index-document index.html \
  --error-document index.html
```

### Step 2: Configure Bucket Policy

Create a file named `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::blogs.suhebghare.tech/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket blogs.suhebghare.tech \
  --policy file://bucket-policy.json
```

### Step 3: Upload Website Files

```bash
# Upload all files to S3
aws s3 sync . s3://blogs.suhebghare.tech \
  --exclude ".git/*" \
  --exclude "README.md" \
  --exclude "bucket-policy.json" \
  --cache-control "max-age=3600"

# Set longer cache for static assets
aws s3 cp styles.css s3://blogs.suhebghare.tech/styles.css \
  --cache-control "max-age=86400"
```

### Step 4: Create CloudFront Distribution

```bash
# Create CloudFront distribution (via AWS Console or CLI)
aws cloudfront create-distribution \
  --origin-domain-name blogs.suhebghare.tech.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html
```

Or use Terraform:

```hcl
resource "aws_cloudfront_distribution" "blog" {
  origin {
    domain_name = aws_s3_bucket.blog.bucket_regional_domain_name
    origin_id   = "S3-blogs.suhebghare.tech"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.blog.cloudfront_access_identity_path
    }
  }

  enabled             = true
  default_root_object = "index.html"
  aliases             = ["blogs.suhebghare.tech"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-blogs.suhebghare.tech"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.blog.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
```

### Step 5: Configure DNS

Add a CNAME record in your DNS provider:

```
Type: CNAME
Name: blogs
Value: d1234567890.cloudfront.net (your CloudFront domain)
TTL: 300
```

### Step 6: Request SSL Certificate (Optional but Recommended)

```bash
# Request certificate in us-east-1 (required for CloudFront)
aws acm request-certificate \
  --domain-name blogs.suhebghare.tech \
  --validation-method DNS \
  --region us-east-1
```

Validate the certificate by adding the DNS records provided by ACM.

### Updating the Website

```bash
# Sync changes to S3
aws s3 sync . s3://blogs.suhebghare.tech \
  --exclude ".git/*" \
  --exclude "README.md" \
  --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to S3

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Sync to S3
        run: |
          aws s3 sync . s3://blogs.suhebghare.tech \
            --exclude ".git/*" \
            --exclude ".github/*" \
            --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

## Local Development

Simply open `index.html` in your browser to preview the website locally.

## Website Structure

```
.
├── index.html                          # Homepage with blog index
├── styles.css                          # Global stylesheet
├── observability-monitoring.html       # Observability blog post
├── kubernetes-guide.html               # Kubernetes blog post
├── infrastructure-as-code.html         # IaC blog post
├── linux-server-management.html        # Linux blog post
├── security-best-practices.html        # Security blog post
├── devops-automation.html              # DevOps automation blog post
├── cloud-cost-optimization.html        # Cost optimization blog post
├── incident-response-postmortems.html  # Incident response blog post
└── README.md                           # This file
```

## Features

- Responsive design
- Clean, modern UI
- SEO-friendly structure
- Fast loading (static HTML/CSS)
- CloudFront CDN for global performance
- HTTPS enabled
- Blog posts sorted by date (newest first)

## Cost Estimate

- S3 Storage: ~$0.023/GB/month
- S3 Requests: ~$0.0004/1000 requests
- CloudFront: ~$0.085/GB for first 10TB
- Route53: ~$0.50/month per hosted zone

Expected monthly cost for low-traffic blog: $1-5/month

## License

© 2024 Suheb Ghare. All rights reserved.
