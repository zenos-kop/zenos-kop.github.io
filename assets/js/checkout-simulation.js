/**
 * eCustomers - Enhanced Checkout Simulation
 * Realistic checkout process with payment simulation
 */
class CheckoutManager {
  constructor() {
    this.cart = [];
    this.checkoutForm = null;
    this.orderSummary = null;
    this.init();
  }

  init() {
    this.loadCart();
    this.setupCheckoutForm();
    this.setupOrderSummary();
    this.setupPaymentMethods();
    this.setupValidation();
  }

  loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  setupCheckoutForm() {
    this.checkoutForm = document.getElementById('checkoutForm');
    if (!this.checkoutForm) return;

    this.checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processOrder();
    });
  }

  setupOrderSummary() {
    this.orderSummary = document.getElementById('orderSummary');
    if (!this.orderSummary) return;

    this.renderOrderSummary();
    this.calculateTotals();
  }

  setupPaymentMethods() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.updatePaymentInfo(e.target.value);
      });
    });
  }

  setupValidation() {
    const form = this.checkoutForm;
    if (!form) return;

    // Bootstrap validation
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  }

  renderOrderSummary() {
    if (!this.orderSummary || this.cart.length === 0) {
      this.orderSummary.innerHTML = '<p class="text-muted">Keranjang kosong</p>';
      return;
    }

    let total = 0;
    let html = '';

    this.cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      html += `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center">
            <img src="../assets/images/${item.image}" alt="${item.name}" 
                 style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 12px;">
            <div>
              <h6 class="mb-0">${item.name}</h6>
              <small class="text-muted">${item.quantity} × ${this.formatCurrency(item.price)}</small>
            </div>
          </div>
          <span class="fw-bold">${this.formatCurrency(itemTotal)}</span>
        </div>
      `;
    });

    this.orderSummary.innerHTML = html;
    this.calculateTotals();
  }

  calculateTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15000; // Fixed shipping cost
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = this.formatCurrency(subtotal);
    document.getElementById('shipping').textContent = this.formatCurrency(shipping);
    document.getElementById('finalTotal').textContent = this.formatCurrency(total);
  }

  updatePaymentInfo(method) {
    const paymentInfo = document.getElementById('paymentInfo');
    if (!paymentInfo) return;

    const info = {
      cod: 'Bayar saat barang sampai',
      transfer: 'Transfer ke rekening: 1234567890 (BCA)',
      ewallet: 'Scan QRIS untuk pembayaran'
    };

    paymentInfo.innerHTML = `<small class="text-muted">${info[method]}</small>`;
  }

  processOrder() {
    const formData = new FormData(this.checkoutForm);
    const orderData = {
      id: this.generateOrderId(),
      date: new Date().toISOString(),
      items: this.cart,
      customer: {
        name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        province: formData.get('province'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode')
      },
      paymentMethod: formData.get('paymentMethod'),
      notes: formData.get('notes'),
      total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 15000
    };

    // Simulate processing
    this.showProcessing();

    setTimeout(() => {
      this.completeOrder(orderData);
    }, 2000);
  }

  showProcessing() {
    const button = this.checkoutForm.querySelector('button[type="submit"]');
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';
    button.disabled = true;
  }

  completeOrder(orderData) {
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');

    // Show success
    this.showSuccessMessage(orderData);
  }

  showSuccessMessage(orderData) {
    const modalHTML = `
      <div class="modal fade" id="orderSuccessModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Pesanan Berhasil!</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
              <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
              <h4 class="mt-3">Terima kasih atas pesanan Anda!</h4>
              <p>Nomor pesanan: <strong>${orderData.id}</strong></p>
              <p>Total: <strong>${this.formatCurrency(orderData.total)}</strong></p>
              <p>Kami akan segera memproses pesanan Anda.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" onclick="window.location.href='../index.html'">
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
    modal.show();

    // Redirect after 5 seconds
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 5000);
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  }

  generateOrderId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `EC${timestamp.slice(-6)}${random}`;
  }
}

// Initialize checkout manager
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('checkout.html')) {
    window.checkoutManager = new CheckoutManager();
  }
});
