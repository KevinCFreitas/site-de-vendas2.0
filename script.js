const products = [
  { id: 1, name: 'Camiseta Básica', price: 59.9 },
  { id: 2, name: 'Tênis Casual', price: 199.9 },
  { id: 3, name: 'Mochila Urbana', price: 149.9 },
  { id: 4, name: 'Relógio Esportivo', price: 289.9 }
];

const cart = [];

const productsEl = document.getElementById('products');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const searchEl = document.getElementById('search');
const checkoutEl = document.getElementById('checkout');

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts(items) {
  productsEl.innerHTML = '';

  if (!items.length) {
    productsEl.innerHTML = '<p class="empty">Nenhum produto encontrado.</p>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p class="price">${formatBRL(item.price)}</p>
      <button type="button">Adicionar ao carrinho</button>
    `;

    card.querySelector('button').addEventListener('click', () => {
      cart.push(item);
      renderCart();
    });

    productsEl.appendChild(card);
  });
}

function renderCart() {
  cartItemsEl.innerHTML = '';

  if (!cart.length) {
    cartItemsEl.innerHTML = '<li>Carrinho vazio.</li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - ${formatBRL(item.price)}`;
      cartItemsEl.appendChild(li);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent = `Total: ${formatBRL(total)}`;
  cartCountEl.textContent = `${cart.length} ${cart.length === 1 ? 'item' : 'itens'}`;
}

searchEl.addEventListener('input', (event) => {
  const term = event.target.value.toLowerCase().trim();
  const filtered = products.filter((product) => product.name.toLowerCase().includes(term));
  renderProducts(filtered);
});

checkoutEl.addEventListener('click', () => {
  if (!cart.length) {
    alert('Seu carrinho está vazio.');
    return;
  }

  alert(`Compra finalizada! Itens: ${cart.length} | ${cartTotalEl.textContent}`);
  cart.length = 0;
  renderCart();
});

renderProducts(products);
renderCart();
