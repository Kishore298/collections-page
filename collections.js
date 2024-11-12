let cart = [];

// Store the loaded products globally
let loadedProducts = [];

// Sort Products based on Selected Option
function sortProducts() {
  const sortOption = document.getElementById("sort-options").value;
  if (sortOption === "low-to-high") {
    loadedProducts.sort((a, b) => a.product.variants[0].price - b.product.variants[0].price);
  } else if (sortOption === "high-to-low") {
    loadedProducts.sort((a, b) => b.product.variants[0].price - a.product.variants[0].price);
  }
  displayProducts(loadedProducts);
}

// Function to Load Products
function loadProducts() {
  document.getElementById("load-products-button").classList.add("hidden");
  document.getElementById("loader").classList.remove("hidden");

  fetch("https://run.mocky.io/v3/92348b3d-54f7-4dc5-8688-ec7d855b6cce?mocky-delay=500ms")
    .then((response) => response.json())
    .then((data) => {
      loadedProducts = data; // Store loaded products globally
      displayProducts(loadedProducts);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    })
    .finally(() => {
      document.getElementById("loader").classList.add("hidden");
    });
}


// Function to Display Products
function displayProducts(products) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";

  products.forEach((item) => {
    const product = item.product;
    const price = product.variants[0].price;
    const imageUrl = product.images[0].src;
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${imageUrl}" alt="${product.title}">
<div class="product-details">
  <h3>${product.title}</h3>
  <p class="product-price">₹${price}</p>
  <button class="add-to-cart-button" onclick="addToCart('${product.id}', '${product.title}', ${price}, '${imageUrl}')">
    <span class="cart-icon">🛒</span> Add to Cart
  </button>
</div>

    `;
    productContainer.appendChild(productCard);
  });
}

// Add Product to Cart
function addToCart(id, title, price, imageUrl) {
  const existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ id, title, price, imageUrl, quantity: 1 });
  }

  updateCartIcon();
}

// Update Cart Icon Count
function updateCartIcon() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}

// Toggle Cart Visibility
function toggleCart() {
  document.getElementById("cart-container").classList.toggle("hidden");
  displayCartItems();
}

// Display Items in Cart
function displayCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <div class="cart-item">
  <img src="${item.imageUrl}" alt="${item.title}" class="cart-item-image">
  <div class="cart-item-content">
    <div class="cart-item-title">${item.title}</div>
    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)" class="cart-item-quantity">
    <button onclick="removeFromCart('${item.id}')" class="cart-item-delete">Delete Product</button>
    <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
  </div>
</div>

    `;

    cartItemsContainer.appendChild(cartItem);
  });

  updateTotalPrice();
}

// Update Quantity of Cart Item
function updateQuantity(id, quantity) {
  const product = cart.find((item) => item.id === id);
  if (product) {
    product.quantity = parseInt(quantity);
  }
  displayCartItems();
}

// Remove Item from Cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartIcon();
  displayCartItems();
}

// Update Total Price
function updateTotalPrice() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("total-price").textContent = `₹${total.toFixed(2)}`;
}

