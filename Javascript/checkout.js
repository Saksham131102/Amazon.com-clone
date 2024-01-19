import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity
} from "../data/cart.js";

import {
  products
} from "../data/products.js";

import {
  formatPrice
} from "./utils/money.js";

let cartSummaryHTML = '';

// Generating the checkout page through javascript.
cart.forEach((cartItem) => {

  // For each cartItem, we are taking their productId so that we can find the product in the products array.
  const productId = cartItem.productId;

  // Looping through products array to find the product
  let matchingProduct;
  products.forEach((product) => {
    if(product.id === productId)
      matchingProduct = product;
  });

  // Now, matchingProduct refers to the product in the products array
  // through which we now can access each property of the product.

  // Generating HTML
  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatPrice(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number">
            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">
              Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

// Showing the cart quantity as the page reloads
updateCartQuantity();

function updateCartQuantity() {
  let totalQuantity = calculateCartQuantity();
  if(totalQuantity > 0)
    document.querySelector('.js-return-to-home-link').innerHTML = `${totalQuantity} items`;
  else
  document.querySelector('.js-return-to-home-link').innerHTML = '';
}

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    // Removing the product from the cart
    // Importing from "cart.js"
    removeFromCart(productId);

    // Removing the cart item from the DOM
    let container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    
    // updating the cart quantity after deleting the product from the cart.
    updateCartQuantity();
  });
});

document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add('is-editing-quantity');
  });
});

document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    const newQuantity = Number(quantityInput.value);

    if(newQuantity < 0 || newQuantity >= 1000) {
      alert("The quantity must be at least 0 or less than 1000.");
      return;
    }
    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.remove('is-editing-quantity');

    updateQuantity(productId, newQuantity);

    updateCartQuantity();
  })
});