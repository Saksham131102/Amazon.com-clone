import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption
} from "../../data/cart.js";

import {
  getProduct
} from "../../data/products.js";

import {
  formatPrice
} from "../utils/money.js";

import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate
} from "../../data/deliveryOptions.js";

import { renderPaymentSummary } from "./paymentSummary.js";

import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {

  let cartSummaryHTML = '';

  // Generating the checkout page through javascript.
  cart.forEach((cartItem) => {

    // For each cartItem, we are taking their productId so that we can find the product in the products array.
    const productId = cartItem.productId;

    // Looping through products array to find the product
    const matchingProduct = getProduct(productId);

    // Now, matchingProduct refers to the product in the products array
    // through which we now can access each property of the product.

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    // Generating HTML
    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
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
            ${deliveryOptionHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {

      const dateString = calculateDeliveryDate(deliveryOption);

      const priceCents = deliveryOption.priceCents;
      let priceString;
      if(priceCents === 0)
        priceString = "FREE Shipping";
      else
        priceString = `$${formatPrice(priceCents)} - Shipping`;

      const checkID = cartItem.deliveryOptionId === deliveryOption.id;

      html += 
      `<div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${checkID ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            $${priceString}
          </div>
        </div>
      </div>`; 
    });
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  // Showing the cart quantity as the page reloads
  // updateCartQuantity();

  // function updateCartQuantity() {
  //   renderCheckoutHeader();
  // }
  renderCheckoutHeader();

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      // Removing the product from the cart
      // Importing from "cart.js"
      removeFromCart(productId);

      // updating the cart quantity after deleting the product from the cart.
      renderCheckoutHeader();

      // Removing the cart item from the DOM
      // let container = document.querySelector(`.js-cart-item-container-${productId}`);
      // container.remove();

      // Instead of deleting the element using DOM, that we did just above,
      // We re-rendered the order summary page.
      renderOrderSummary();

      // re-rendering the payment summary page
      renderPaymentSummary();
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

      renderCheckoutHeader();

      renderPaymentSummary();
    })
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
    })
  });

}
