const blogStats = {
    initialData: {"reusable-cicd-templates":{"reads":786,"likes":486,"dislikes":36},"secrets-management-environments":{"reads":749,"likes":382,"dislikes":44},"argo-rollouts-canary-deployments":{"reads":757,"likes":509,"dislikes":24},"self-hosted-runners-eks":{"reads":645,"likes":341,"dislikes":28},"platform-engineering-vs-devops":{"reads":821,"likes":446,"dislikes":42},"building-internal-developer-platform":{"reads":793,"likes":496,"dislikes":29},"ai-reduce-alert-fatigue":{"reads":645,"likes":325,"dislikes":19},"llm-analyze-incident-logs":{"reads":877,"likes":480,"dislikes":40},"ai-aws-cost-anomaly-detection":{"reads":722,"likes":395,"dislikes":36},"can-ai-replace-oncall-engineers":{"reads":838,"likes":576,"dislikes":44},"building-ai-agent-infrastructure":{"reads":699,"likes":477,"dislikes":40},"mcp-servers-devops-automation":{"reads":869,"likes":473,"dislikes":32},"chatgpt-terraform-safety":{"reads":694,"likes":426,"dislikes":27},"waf-rules-bot-protection":{"reads":606,"likes":320,"dislikes":32},"geo-blocking-vs-rate-limiting":{"reads":887,"likes":461,"dislikes":42},"credential-stuffing-aws":{"reads":745,"likes":452,"dislikes":40},"secure-ecommerce-architecture":{"reads":721,"likes":423,"dislikes":22},"iso27001-devops-controls":{"reads":818,"likes":523,"dislikes":28},"cloudfront-waf-best-practices":{"reads":844,"likes":489,"dislikes":33},"api-abuse-prevention-kubernetes":{"reads":756,"likes":498,"dislikes":29},"black-friday-aws-cost-reduction":{"reads":681,"likes":468,"dislikes":38},"production-node-groups-strategy":{"reads":878,"likes":450,"dislikes":31},"pod-disruption-budgets-guide":{"reads":887,"likes":612,"dislikes":44},"statefulsets-production-lessons":{"reads":745,"likes":425,"dislikes":39},"karpenter-vs-cluster-autoscaler":{"reads":632,"likes":331,"dislikes":20},"multi-environment-eks":{"reads":684,"likes":422,"dislikes":25},"incident-response-postmortems":{"reads":618,"likes":397,"dislikes":24},"cloud-cost-optimization":{"reads":730,"likes":450,"dislikes":37},"devops-automation":{"reads":763,"likes":451,"dislikes":43},"security-best-practices":{"reads":656,"likes":420,"dislikes":34},"linux-server-management":{"reads":719,"likes":484,"dislikes":21},"infrastructure-as-code":{"reads":704,"likes":413,"dislikes":23},"kubernetes-guide":{"reads":789,"likes":537,"dislikes":29},"observability-monitoring":{"reads":659,"likes":459,"dislikes":38},"aws-serverless-architecture":{"reads":792,"likes":524,"dislikes":30},"aws-compute-types":{"reads":845,"likes":527,"dislikes":48},"aws-storage-types":{"reads":716,"likes":438,"dislikes":33}},
    
    init() {
        try {
            const existing = localStorage.getItem('blogStats');
            if (!existing) {
                localStorage.setItem('blogStats', JSON.stringify(this.initialData));
            }
        } catch(e) {
            console.error('localStorage error:', e);
        }
    },
    
    getStats(blogId) {
        try {
            const stats = JSON.parse(localStorage.getItem('blogStats') || '{}');
            return stats[blogId] || this.initialData[blogId] || { reads: 0, likes: 0, dislikes: 0 };
        } catch(e) {
            return this.initialData[blogId] || { reads: 0, likes: 0, dislikes: 0 };
        }
    },
    
    incrementRead(blogId) {
        try {
            const stats = JSON.parse(localStorage.getItem('blogStats') || '{}');
            if (!stats[blogId]) stats[blogId] = this.initialData[blogId] || { reads: 0, likes: 0, dislikes: 0 };
            stats[blogId].reads++;
            localStorage.setItem('blogStats', JSON.stringify(stats));
            this.updateDisplay(blogId);
        } catch(e) {
            console.error('Error incrementing read:', e);
        }
    },
    
    like(blogId) {
        try {
            const stats = JSON.parse(localStorage.getItem('blogStats') || '{}');
            if (!stats[blogId]) stats[blogId] = this.initialData[blogId] || { reads: 0, likes: 0, dislikes: 0 };
            stats[blogId].likes++;
            localStorage.setItem('blogStats', JSON.stringify(stats));
            this.updateDisplay(blogId);
        } catch(e) {
            console.error('Error liking:', e);
        }
    },
    
    dislike(blogId) {
        try {
            const stats = JSON.parse(localStorage.getItem('blogStats') || '{}');
            if (!stats[blogId]) stats[blogId] = this.initialData[blogId] || { reads: 0, likes: 0, dislikes: 0 };
            stats[blogId].dislikes++;
            localStorage.setItem('blogStats', JSON.stringify(stats));
            this.updateDisplay(blogId);
        } catch(e) {
            console.error('Error disliking:', e);
        }
    },
    
    updateDisplay(blogId) {
        const stats = this.getStats(blogId);
        const readsEl = document.querySelector('.reads-count');
        const likesEl = document.querySelector('.likes-count');
        const dislikesEl = document.querySelector('.dislikes-count');
        
        if (readsEl) readsEl.textContent = stats.reads;
        if (likesEl) likesEl.textContent = stats.likes;
        if (dislikesEl) dislikesEl.textContent = stats.dislikes;
    }
};

blogStats.init();
