// Main application logic
const Store = {
    key: 'ec_products',
    
    async list() {
        const cached = localStorage.getItem(this.key);
        if (cached) return JSON.parse(cached);
        
        try {
            const res = await fetch('assets/data/products.seed.json');
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn('Seed fetch failed', e);
        }
        return [];
    },
    
    save(items) {
        localStorage.setItem(this.key, JSON.stringify(items));
    }
};

// Initialize store on load
document.addEventListener('DOMContentLoaded', async function() {
    const products = await Store.list();
    console.log('Products loaded:', products.length);
});
