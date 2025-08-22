// Cart functionality
const Cart = {
    key: 'ec_cart',
    
    items() {
        return JSON.parse(localStorage.getItem(this.key) || '[]');
    },
    
    save(items) {
        localStorage.setItem(this.key, JSON.stringify(items));
        this.updateCount();
    },
    
    add(item) {
        const list = this.items();
        const existing = list.find(x => x.id === item.id);
        
        if (existing) {
            existing.qty += item.qty || 1;
        } else {
            list.push({
                id: item.id,
                name: item.name,
                qty: item.qty || 1,
                price: item.price
            });
        }
        
        this.save(list);
    },
    
    remove(id) {
        this.save(this.items().filter(x => x.id !== id));
    },
    
    clear() {
        this.save([]);
    },
    
    total() {
        return this.items().reduce((sum, item) => sum + (item.price * item.qty), 0);
    },
    
    updateCount() {
        const count = this.items().reduce((sum, item) => sum + item.qty, 0);
        const elements = document.querySelectorAll('#cartCount');
        elements.forEach(el => {
            if (el) el.textContent = count;
        });
    }
};

// Currency formatter
function rupiah(n) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(n);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCount();
});

// Export for use in other files
window.Cart = Cart;
window.rupiah = rupiah;
