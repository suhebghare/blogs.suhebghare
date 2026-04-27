# Tech Blog — blogs.suhebghare.tech

A static tech blog focused on DevOps, SRE, Cloud Infrastructure, and Automation — built with pure HTML/CSS and deployed on AWS S3 + CloudFront.

**Live:** [https://blogs.suhebghare.tech](https://blogs.suhebghare.tech)  
**Portfolio:** [https://portfolio.suhebghare.tech](https://portfolio.suhebghare.tech)

---

## Blog Posts (37 Articles)

### CI/CD & Platform Engineering
- [Designing Reusable CI/CD Templates](reusable-cicd-templates.html)
- [Secrets Management Across Environments](secrets-management-environments.html)
- [Argo Rollouts & Canary Deployments](argo-rollouts-canary-deployments.html)
- [Self-Hosted Runners on EKS – Architecture & Pitfalls](self-hosted-runners-eks.html)
- [Platform Engineering vs DevOps – What's the Difference?](platform-engineering-vs-devops.html)
- [Building an Internal Developer Platform](building-internal-developer-platform.html)
- [DevOps Automation & CI/CD](devops-automation.html)

### AI & DevOps
- [How AI Can Help SREs Reduce Alert Fatigue](ai-reduce-alert-fatigue.html)
- [Using LLMs to Analyze Incident Logs](llm-analyze-incident-logs.html)
- [AI for AWS Cost Anomaly Detection](ai-aws-cost-anomaly-detection.html)
- [Can AI Replace On-Call Engineers?](can-ai-replace-oncall-engineers.html)
- [Building an AI Agent for Your Infrastructure](building-ai-agent-infrastructure.html)
- [MCP Servers and the Future of DevOps Automation](mcp-servers-devops-automation.html)
- [ChatGPT + Terraform – Is It Safe?](chatgpt-terraform-safety.html)

### Security
- [Designing WAF Rules That Stop Bots](waf-rules-bot-protection.html)
- [Geo-Blocking vs Rate Limiting – What Works?](geo-blocking-vs-rate-limiting.html)
- [Handling Credential Stuffing Attacks in AWS](credential-stuffing-aws.html)
- [Secure Architecture Patterns for E-commerce](secure-ecommerce-architecture.html)
- [ISO 27001 Controls for DevOps Engineers](iso27001-devops-controls.html)
- [CloudFront + WAF Best Practices](cloudfront-waf-best-practices.html)
- [Preventing API Abuse in Kubernetes](api-abuse-prevention-kubernetes.html)
- [Security Best Practices](security-best-practices.html)

### Kubernetes
- [Reduced Black Friday AWS Spend by 52%](black-friday-aws-cost-reduction.html)
- [Production-Grade Node Groups Strategy](production-node-groups-strategy.html)
- [PodDisruptionBudgets: Common Misconfigurations](pod-disruption-budgets-guide.html)
- [Running StatefulSets in Production](statefulsets-production-lessons.html)
- [Karpenter vs Cluster Autoscaler](karpenter-vs-cluster-autoscaler.html)
- [Multi-Environment EKS Design](multi-environment-eks.html)
- [Kubernetes in Modern Infrastructure](kubernetes-guide.html)

### Cloud & Infrastructure
- [Cloud Cost Optimization](cloud-cost-optimization.html)
- [Infrastructure as Code](infrastructure-as-code.html)
- [AWS Serverless Architecture](aws-serverless-architecture.html)
- [AWS Compute Types & Cost Optimization](aws-compute-types.html)
- [AWS Storage Types & Optimization](aws-storage-types.html)
- [Linux for Server Management](linux-server-management.html)

### Observability & Incident Response
- [Observability & Monitoring](observability-monitoring.html)
- [Incident Response & Postmortems](incident-response-postmortems.html)

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Static HTML, CSS, JavaScript |
| Hosting | AWS S3 (Static Website Hosting) |
| CDN | AWS CloudFront |
| SSL | AWS ACM (Certificate Manager) |
| DNS | Route 53 / Custom DNS |
| CI/CD | GitHub Actions |
| Container | Docker + Nginx (alternative deployment) |
| GitOps | ArgoCD (for Kubernetes-based deployment) |

---

## Repository Structure

```
.
├── .github/
│   └── workflows/
│       ├── deploy.yml                          # S3 + CloudFront deployment
│       └── argocd-deploy.yml                   # ArgoCD/EKS deployment
├── images/                                     # Blog post images & diagrams
│   ├── app-sec1.jpg
│   ├── eks-cluster.png
│   ├── finops-1.png, finops-2.png, finops-3.png
│   ├── grafana1.svg
│   ├── k8s-cluster.svg
│   ├── k8s-hpa-vs-vpa.gif
│   ├── olly1.jpg
│   ├── otel1.png
│   └── waf1.png
├── index.html                                  # Homepage with blog index
├── styles.css                                  # Global stylesheet
├── blog-stats.js                               # Client-side stats loader
├── blog-stats.json                             # Stats data (gitignored)
├── deploy.sh                                   # Manual deployment script
├── Dockerfile                                  # Nginx container for K8s deployment
├── .dockerignore
├── .gitignore
├── STATS_README.md                             # Blog stats system documentation
├── README.md                                   # This file
└── *.html                                      # 37 blog post pages
```

---

## Deployment

This project supports two deployment strategies:

### Strategy 1: AWS S3 + CloudFront (Primary)

Automated via GitHub Actions on push to `main`.

**Workflow:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

```
Push to main → GitHub Actions → Sync to S3 → Invalidate CloudFront Cache
```

**What the workflow does:**
1. Checks out the code
2. Configures AWS credentials from GitHub Secrets
3. Downloads existing `blog-stats.json` from S3 (preserves read/like counters)
4. Syncs all files to S3 (excluding `.git`, `.github`, `README.md`, `blog-stats.json`)
5. Uploads `blog-stats.json` separately (to preserve stats)
6. Invalidates CloudFront cache

**Required GitHub Secrets:**
| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `REGION` | AWS region (e.g. `us-east-1`) |
| `S3_BUCKET` | S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |

**Manual deployment:**
```bash
./deploy.sh
```

### Strategy 2: ArgoCD + EKS (Kubernetes)

Automated via GitHub Actions on push to `staging`.

**Workflow:** [`.github/workflows/argocd-deploy.yml`](.github/workflows/argocd-deploy.yml)

```
Push to staging → GitHub Actions → Build Docker Image → Push to ECR → Update ArgoCD values.yaml → ArgoCD syncs to EKS
```

**What the workflow does:**
1. Checks out the code
2. Fetches secrets from AWS Secrets Manager
3. Builds a Docker image (Nginx serving static files)
4. Pushes the image to Amazon ECR
5. Clones the ArgoCD templates repo
6. Updates `values.yaml` with the new image tag (git commit SHA)
7. ArgoCD detects the change and deploys to EKS

**Required GitHub Secrets:**
| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM access key (staging) |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key (staging) |
| `AWS_ACCESS_KEY_ID_PROD` | IAM access key (production) |
| `AWS_SECRET_ACCESS_KEY_PROD` | IAM secret key (production) |
| `ARGOCD_SSH_PVT_KEY` | SSH private key for ArgoCD repo |
| `ORG_PAT_TOKEN` | GitHub PAT for cloning ArgoCD templates |

**Docker image:**
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## AWS Infrastructure Setup

### S3 Bucket

```bash
aws s3 mb s3://blogs.suhebghare.tech --region us-east-1

aws s3 website s3://blogs.suhebghare.tech \
  --index-document index.html \
  --error-document index.html
```

### Bucket Policy

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

### CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --origin-domain-name blogs.suhebghare.tech.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html
```

### SSL Certificate

```bash
aws acm request-certificate \
  --domain-name blogs.suhebghare.tech \
  --validation-method DNS \
  --region us-east-1
```

### DNS

```
Type: CNAME
Name: blogs
Value: <cloudfront-distribution-domain>.cloudfront.net
TTL: 300
```

---

## Blog Stats System

- Stats (reads, likes, dislikes) are stored in `blog-stats.json` on S3
- The file is **gitignored** to avoid overwriting live counters
- During deployment, stats are downloaded from S3 first, then re-uploaded after sync
- Client-side JavaScript (`blog-stats.js`) loads stats dynamically on page load
- Like/Dislike buttons update the display in-memory (static site — no backend persistence)

> For production-grade analytics, consider AWS API Gateway + Lambda + DynamoDB or Google Analytics.

See [STATS_README.md](STATS_README.md) for full details.

---

## Local Development

```bash
# Simply open in browser
open index.html

# Or serve with Python
python3 -m http.server 8080

# Or run with Docker
docker build -t blog .
docker run -p 8080:80 blog
```

---

## Features

- Responsive design with clean, modern UI
- 37 in-depth blog posts across 6 categories
- Blog stats (reads, likes, dislikes) per post
- SEO-friendly static HTML/CSS
- Fast loading — no JavaScript frameworks
- CloudFront CDN for global performance
- HTTPS via ACM
- Dual deployment: S3 + CloudFront and ArgoCD + EKS
- Automated CI/CD with GitHub Actions

---

## Cost Estimate (S3 + CloudFront)

| Service | Cost |
|---------|------|
| S3 Storage | ~$0.023/GB/month |
| S3 Requests | ~$0.0004/1000 requests |
| CloudFront | ~$0.085/GB (first 10TB) |
| Route 53 | ~$0.50/month per hosted zone |

**Expected monthly cost for low-traffic blog: $1–5/month**

---

## License

© 2024 Suheb Ghare. All rights reserved.
