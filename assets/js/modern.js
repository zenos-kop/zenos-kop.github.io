// Modern eCustomers JavaScript
const CONFIG = {
  whatsappNumber: '6283172673414', // Ganti dengan nomor WhatsApp Anda
  businessName: 'eCustomers',
  currency: 'Rp'
};

// Product data management
class ProductManager {
  constructor() {
    this.products = [];
    this.cart = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const response = await fetch('assets/data/products.seed.json');
      this.products = await response.json();
      this.renderProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  getProductById(id) {
    return this.products.find(p => p.id === parseInt(id));
  }

  getProductsByCategory(category) {
    return this.products.filter(p => p.category === category);
  }

  getPromoProducts() {
    return this.products.filter(p => p.promo);
  }

  getFeaturedProducts() {
    return this.products.slice(0, 8);
  }
}

// Cart functionality
class CartManager {
  constructor() {
    this.cart = this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('ecustomers-cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('ecustomers-cart', JSON.stringify(this.cart));
  }

  addToCart(product, quantity = 1) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }
    this.saveCart();
    this.updateCartCount();
    this.showToast('Produk ditambahkan ke keranjang');
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartCount();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateCartCount() {
    const count = this.getItemCount();
    const elements = document.querySelectorAll('#cartCount, #cartCountMobile');
    elements.forEach(el => {
      if (el) el.textContent = count;
    });
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartCount();
  }

  showToast(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = 'toast show position-fixed top-0 end-0 m-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">eCustomers</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${message}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

// WhatsApp integration
class WhatsAppManager {
  static generateMessage(product, quantity = 1) {
    const total = product.price * quantity;
    return `Halo, saya ingin memesan:
    
Produk: ${product.name}
Jumlah: ${quantity} pcs
Harga: ${CONFIG.currency} ${product.price.toLocaleString('id-ID')}
Total: ${CONFIG.currency} ${total.toLocaleString('id-ID')}

Terima kasih!`;
  }

  static generateCartMessage(cartItems) {
    let message = `Halo, saya ingin memesan:\n\n`;
    let total = 0;
    
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      message += `- ${item.name} (${item.quantity} pcs) = ${CONFIG.currency} ${itemTotal.toLocaleString('id-ID')}\n`;
    });
    
    message += `\nTotal: ${CONFIG.currency} ${total.toLocaleString('id-ID')}`;
    message += `\n\nTerima kasih!`;
    
    return message;
  }

  static openWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }

  static buyNow(product, quantity = 1) {
    const message = this.generateMessage(product, quantity);
    this.openWhatsApp(message);
  }

  static checkoutCart(cartItems) {
    if (cartItems.length === 0) {
      alert('Keranjang belanja kosong');
      return;
    }
    const message = this.generateCartMessage(cartItems);
    this.openWhatsApp(message);
  }
}

// Theme management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupToggleButtons();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle buttons
    const icon = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    const buttons = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    buttons.forEach(btn => {
      if (btn) {
        btn.innerHTML = btn.id === 'themeToggleMobile' 
          ? `<i class="${icon}"></i> ${theme === 'light' ? 'Dark' : 'Light'} Mode`
          : `<i class="${icon}"></i>`;
      }
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
  }

  setupToggleButtons() {
    const buttons = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    buttons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => this.toggleTheme());
      }
    });
  }
}

// Utility functions
const Utils = {
  formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  },

  formatImagePath(image) {
    return image.startsWith('http') ? image : `assets/images/${image}`;
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Initialize managers
  window.productManager = new ProductManager();
  window.cartManager = new CartManager();
  window.themeManager = new ThemeManager();
  
  // Update cart count on load
  window.cartManager.updateCartCount();
  
  // Setup search functionality
  const searchForms = document.querySelectorAll('form[role="search"]');
  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = form.querySelector('input[type="search"]').value;
      if (query) {
        window.location.href = `kategori.html?q=${encodeURIComponent(query)}`;
      }
    });
  });
});

// Global functions for HTML onclick
window.addToCart = function(productId, quantity = 1) {
  const product = window.productManager.getProductById(productId);
  if (product) {
    window.cartManager.addToCart(product, quantity);
  }
};

window.buyNow = function(productId, quantity = 1) {
  const product = window.productManager.getProductById(productId);
  if (product) {
    WhatsAppManager.buyNow(product, quantity);
  }
};

window.checkout = function() {
  WhatsAppManager.checkoutCart(window.cartManager.cart);
  window.cartManager.clearCart();
};
