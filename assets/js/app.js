// Theme toggle
(function(){ 
  const html = document.documentElement;
  const key = 'ec_theme';
  const saved = localStorage.getItem(key);
  if(saved) html.setAttribute('data-theme', saved);
  function toggle(){ 
    const now = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', now);
    localStorage.setItem(key, now);
  }
  document.addEventListener('click', (e) => {
    if(e.target && (e.target.id === 'themeToggle' || e.target.id === 'themeToggleMobile')) { e.preventDefault(); toggle(); }
  });
})();

// Cart
const Cart = {
  key: 'ec_cart',
  items(){ return JSON.parse(localStorage.getItem(this.key)||'[]'); },
  save(x){ localStorage.setItem(this.key, JSON.stringify(x)); updateCartCount(); },
  add(item){ const list = this.items(); const i = list.findIndex(x=>x.id===item.id); if(i>-1) list[i].qty += item.qty; else list.push(item); this.save(list); },
  remove(id){ this.save(this.items().filter(x=>x.id!==id)); },
  clear(){ this.save([]); },
  total(){ return this.items().reduce((a,b)=>a + b.price*b.qty, 0); }
};
function updateCartCount(){
  const count = Cart.items().reduce((a,b)=>a+b.qty,0);
  const el1 = document.getElementById('cartCount'); if(el1) el1.textContent = count;
  const el2 = document.getElementById('cartCountMobile'); if(el2) el2.textContent = count;
}
document.addEventListener('DOMContentLoaded', updateCartCount);

// Currency
function rupiah(n){ return new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(n); }

// Product store: load from localStorage or seed (assets/data/products.seed.json)
const Store = {
  key: 'ec_products',
  async list(){
    const cached = localStorage.getItem(this.key);
    if(cached) return JSON.parse(cached);
    try {
      const res = await fetch('assets/data/products.seed.json'); // Updated path
      if(res.ok) return await res.json();
    } catch(e){ console.warn('seed fetch failed', e); }
    return [];
  },
  save(items){ localStorage.setItem(this.key, JSON.stringify(items)); },
  clear(){ localStorage.removeItem(this.key); }
};

// Helpers
function finalPrice(p){ return p.promo && p.discount ? Math.round(p.price * (100 - p.discount)/100) : p.price; }
function renderGrid(targetId, list){
  const wrap = document.getElementById(targetId);
  if(!wrap) return;
  wrap.innerHTML = '';
  if(!list.length) { wrap.innerHTML = '<div class="text-muted">Belum ada produk.</div>'; return; }
  list.forEach(p=>{
    const col = document.createElement('div');
    col.className = 'col-6 col-md-3 col-lg-2';
    col.innerHTML = `
      <div class="card h-100 card-product">
        <div class="placeholder-img d-flex align-items-center justify-content-center">
          <img src="../assets/images/${p.image||'placeholder.jpg'}" alt="${p.name}" style="max-height:120px">
        </div>
        <div class="card-body">
          <div class="small text-muted">${p.category||'-'}</div>
          <h6 class="card-title mb-1" title="${p.name}">${p.name}</h6>
          <div class="rating text-warning mb-1"><i class="fa-solid fa-star"></i> ${p.rating||'4.5'}</div>
          <div class="d-flex gap-2 align-items-center">
            <span class="fw-bold">${rupiah(finalPrice(p))}</span>
            ${p.promo && p.discount ? `<small class='text-muted text-decoration-line-through'>${rupiah(p.price)}</small><span class='badge badge-promo'>-${p.discount}%</span>` : ''}
          </div>
          <div class="mt-2 d-grid">
            <button class="btn btn-sm btn-dark" onclick='Cart.add({id:${p.id}, name:"${p.name}", qty:1, price:finalPrice(p)})'>Tambah</button>
          </div>
        </div>
      </div>`;
    wrap.appendChild(col);
  });
}

// Cart page renderer
function renderCartPage(){
  const listEl = document.getElementById('cartList'); if(!listEl) return;
  const totalEl = document.getElementById('cartTotal');
  const list = Cart.items();
  listEl.innerHTML = '';
  list.forEach(it=>{
    const div = document.createElement('div');
    div.className = 'list-group-item d-flex justify-content-between align-items-center';
    div.innerHTML = `<div><strong>${it.name}</strong><div class="small text-muted">Qty: ${it.qty}</div></div>
                     <div>${rupiah(it.price*it.qty)} <button class='btn btn-sm btn-outline-danger ms-2' onclick='Cart.remove(${it.id});renderCartPage();'>×</button></div>`;
    listEl.appendChild(div);
  });
  totalEl.textContent = rupiah(Cart.total());
}

// Import page logic
async function initImport(){
  const txt = document.getElementById('jsonInput');
  const info = document.getElementById('importInfo');
  const loadSeedBtn = document.getElementById('loadSeed');
  const saveBtn = document.getElementById('saveProducts');
  if(!txt) return;
  loadSeedBtn.addEventListener('click', async ()=>{
    const items = await Store.list();
    txt.value = JSON.stringify(items, null, 2);
  });
  saveBtn.addEventListener('click', ()=>{
    try {
      const items = JSON.parse(txt.value);
      if(!Array.isArray(items)) throw new Error('Format harus Array []');
      Store.save(items); info.innerHTML = '<div class="alert alert-success">Produk berhasil disimpan ke browser (localStorage). Buka halaman Produk/Promo untuk melihatnya.</div>';
    } catch(e) {
      info.innerHTML = '<div class="alert alert-danger">'+e.message+'</div>';
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{ initImport(); renderCartPage(); });
