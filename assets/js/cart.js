// Cart Management System
class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const response = await fetch('../assets/data/products.seed.json');
      this.products = await response.json();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  loadCart() {
    const saved = localStorage.getItem('ecustomers-cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('ecustomers-cart', JSON.stringify(this.cart));
  }

  addToCart(productId, quantity = 1) {
    const product = this.products.find(p => p.id === parseInt(productId));
    if (!product) {
      console.error('Product not found:', productId);
      return false;
    }

    const existing = this.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        promo: product.promo,
        discount: product.discount,
        quantity: quantity
      });
    }
    
    this.saveCart();
    this.updateCartCount();
    this.showToast('Produk ditambahkan ke keranjang');
    return true;
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartCount();
    this.showToast('Produk dihapus dari keranjang');
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartCount();
      }
    }
  }

  getTotal() {
    return this.cart.reduce((sum, item) => {
      const price = item.promo && item.discount > 0 
        ? Math.round(item.price * (1 - item.discount / 100))
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartItems() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartCount();
  }

  updateCartCount() {
    const count = this.getItemCount();
    const elements = document.querySelectorAll('#cartCount, #cartCountMobile');
    elements.forEach(el => {
      if (el) el.textContent = count;
    });
  }

  showToast(message) {
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

  generateWhatsAppMessage() {
    if (this.cart.length === 0) {
      return null;
    }

    let message = `Halo, saya ingin memesan:\n\n`;
    let total = 0;
    
    this.cart.forEach(item => {
      const price = item.promo && item.discount > 0 
        ? Math.round(item.price * (1 - item.discount / 100))
        : item.price;
      const itemTotal = price * item.quantity;
      total += itemTotal;
      
      message += `- ${item.name} (${item.quantity} pcs) = ${Utils.formatPrice(itemTotal)}\n`;
    });
    
    message += `\nTotal: ${Utils.formatPrice(total)}`;
    message += `\n\nTerima kasih!`;
    
    return message;
  }
}

// Global cart instance
window.cartManager = new CartManager();

// Global cart functions
window.addToCart = function(productId, quantity = 1) {
  return window.cartManager.addToCart(productId, quantity);
};

window.removeFromCart = function(productId) {
  window.cartManager.removeFromCart(productId);
  if (window.renderCart) window.renderCart();
};

window.updateQuantity = function(productId, quantity) {
  window.cartManager.updateQuantity(productId, parseInt(quantity));
  if (window.renderCart) window.renderCart();
};

window.clearCart = function() {
  window.cartManager.clearCart();
  if (window.renderCart) window.renderCart();
};

window.checkoutCart = function() {
  const message = window.cartManager.generateWhatsAppMessage();
  if (!message) {
    alert('Keranjang belanja kosong');
    return;
  }
  
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/6281234567890?text=${encodedMessage}`;
  window.open(url, '_blank');
  
  // Optional: clear cart after checkout
  // window.cartManager.clearCart();
  // if (window.renderCart) window.renderCart();
};
