// ✅ Simple Load More - DRY Principle
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.querySelector('.load-more');
    const articlesWrapper = document.getElementById('articles-wrapper');
    
    if (!loadMoreBtn || !articlesWrapper) return;
    
    loadMoreBtn.addEventListener('click', function() {
        const nextPage = this.dataset.nextPage;
        const currentUrl = window.location.pathname;
        
        // Show loading
        this.innerHTML = 'Loading...';
        this.disabled = true;
        
        // AJAX call
        fetch(`${currentUrl}?page=${nextPage}&ajax=true`)
            .then(response => response.text())
            .then(html => {
                // Parse response
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newArticles = doc.getElementById('articles-wrapper');
                const newLoadBtn = doc.querySelector('.load-more');
                
                if (newArticles) {
                    // Append new articles
                    articlesWrapper.innerHTML += newArticles.innerHTML;
                }
                
                // Update or remove load more button
                if (newLoadBtn) {
                    this.dataset.nextPage = newLoadBtn.dataset.nextPage;
                    this.innerHTML = 'Load More';
                    this.disabled = false;
                } else {
                    // No more articles
                    this.remove();
                }
            })
            .catch(error => {
                console.error('Load more error:', error);
                this.innerHTML = 'Load More';
                this.disabled = false;
            });
    });
});