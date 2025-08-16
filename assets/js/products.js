const products = [
  {
    "id": 201,
    "name": "Handsocks Manset Jempol Muslimah",
    "price": 15000,
    "category": "Fashion Muslim",
    "promo": true,
    "discount": 10,
    "rating": 4.5,
    "image": "handsock.jpg",
    "source": "sarqu.id"
  },
  {
    "id": 202,
    "name": "Inner Ciput Rajut",
    "price": 12000,
    "category": "Hijab",
    "promo": false,
    "discount": 0,
    "rating": 4.8,
    "image": "ciput.jpg",
    "source": "sarqu.id"
  },
  {
    "id": 203,
    "name": "Kaos Kaki Muslimah Tebal",
    "price": 10000,
    "category": "Kaos Kaki",
    "promo": true,
    "discount": 20,
    "rating": 4.6,
    "image": "kaoskaki.jpg",
    "source": "sarqu.id"
  }
];

function renderGrid(containerId, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = list.map(p => `
    <div class="col-6 col-md-3">
      <div class="card h-100 shadow-sm">
        <img src="assets/images/${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body">
          <h6 class="card-title">${p.name}</h6>
          <p class="mb-1 text-danger fw-bold">Rp ${p.price.toLocaleString()}</p>
          ${p.discount > 0 ? `<span class="badge bg-warning text-dark">Diskon ${p.discount}%</span>` : ""}
        </div>
      </div>
    </div>
  `).join('');
}
