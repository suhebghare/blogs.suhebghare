const blogStats = {
    statsData: {},
    
    async init() {
        try {
            const response = await fetch('blog-stats.json');
            this.statsData = await response.json();
        } catch(e) {
            console.error('Error loading stats:', e);
            this.statsData = {"reusable-cicd-templates":{"reads":780,"likes":294,"dislikes":26},"secrets-management-environments":{"reads":779,"likes":328,"dislikes":44},"argo-rollouts-canary-deployments":{"reads":875,"likes":221,"dislikes":32},"self-hosted-runners-eks":{"reads":789,"likes":389,"dislikes":40},"platform-engineering-vs-devops":{"reads":663,"likes":323,"dislikes":20},"building-internal-developer-platform":{"reads":855,"likes":414,"dislikes":40},"ai-reduce-alert-fatigue":{"reads":710,"likes":347,"dislikes":25},"llm-analyze-incident-logs":{"reads":609,"likes":138,"dislikes":27},"ai-aws-cost-anomaly-detection":{"reads":777,"likes":177,"dislikes":32},"can-ai-replace-oncall-engineers":{"reads":884,"likes":286,"dislikes":35},"building-ai-agent-infrastructure":{"reads":639,"likes":314,"dislikes":20},"mcp-servers-devops-automation":{"reads":744,"likes":175,"dislikes":37},"chatgpt-terraform-safety":{"reads":763,"likes":360,"dislikes":33},"waf-rules-bot-protection":{"reads":777,"likes":240,"dislikes":38},"geo-blocking-vs-rate-limiting":{"reads":624,"likes":254,"dislikes":18},"credential-stuffing-aws":{"reads":810,"likes":320,"dislikes":32},"secure-ecommerce-architecture":{"reads":809,"likes":359,"dislikes":24},"iso27001-devops-controls":{"reads":725,"likes":245,"dislikes":25},"cloudfront-waf-best-practices":{"reads":837,"likes":180,"dislikes":37},"api-abuse-prevention-kubernetes":{"reads":762,"likes":175,"dislikes":27},"black-friday-aws-cost-reduction":{"reads":850,"likes":355,"dislikes":26},"production-node-groups-strategy":{"reads":693,"likes":271,"dislikes":40},"pod-disruption-budgets-guide":{"reads":700,"likes":237,"dislikes":36},"statefulsets-production-lessons":{"reads":855,"likes":414,"dislikes":39},"karpenter-vs-cluster-autoscaler":{"reads":821,"likes":355,"dislikes":39},"multi-environment-eks":{"reads":621,"likes":233,"dislikes":26},"incident-response-postmortems":{"reads":819,"likes":327,"dislikes":28},"cloud-cost-optimization":{"reads":629,"likes":313,"dislikes":37},"devops-automation":{"reads":900,"likes":294,"dislikes":40},"security-best-practices":{"reads":827,"likes":217,"dislikes":46},"linux-server-management":{"reads":773,"likes":154,"dislikes":24},"infrastructure-as-code":{"reads":765,"likes":164,"dislikes":41},"kubernetes-guide":{"reads":615,"likes":250,"dislikes":21},"observability-monitoring":{"reads":820,"likes":202,"dislikes":47},"aws-serverless-architecture":{"reads":768,"likes":222,"dislikes":45},"aws-compute-types":{"reads":855,"likes":351,"dislikes":34},"aws-storage-types":{"reads":677,"likes":232,"dislikes":26}};
        }
    },
    
    getStats(blogId) {
        return this.statsData[blogId] || { reads: 0, likes: 0, dislikes: 0 };
    },
    
    incrementRead(blogId) {
        if (!this.statsData[blogId]) this.statsData[blogId] = { reads: 0, likes: 0, dislikes: 0 };
        this.statsData[blogId].reads++;
        this.updateDisplay(blogId);
    },
    
    like(blogId) {
        if (!this.statsData[blogId]) this.statsData[blogId] = { reads: 0, likes: 0, dislikes: 0 };
        this.statsData[blogId].likes++;
        this.updateDisplay(blogId);
    },
    
    dislike(blogId) {
        if (!this.statsData[blogId]) this.statsData[blogId] = { reads: 0, likes: 0, dislikes: 0 };
        this.statsData[blogId].dislikes++;
        this.updateDisplay(blogId);
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
