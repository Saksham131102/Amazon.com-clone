// Importing the cart array from "data/cart.js"
import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";

// Importing the products array from "data/products.js"
import { products } from "../data/products.js"

// Importing the formatPrice function from "utils/money.js"
import { formatPrice } from "./utils/money.js"



// The array 'products' is being taken from "data/products.js" file.

let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${formatPrice(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart item-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button js-add-to-cart button-primary" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `
});

// rendering all the products
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// Showing the cart quantity as the page reloads.
updateCartQuantity();

// Function to Calculate the total quantity of items in the cart
function updateCartQuantity() {
  let totalQuantity = calculateCartQuantity();
  if(totalQuantity > 0)
    document.querySelector('.js-cart-quantity').innerHTML = totalQuantity;
  else
    document.querySelector('.js-cart-quantity').innerHTML = '';
}

// We're going to use an object to save the timeout ids.
// The reason we use an object is because each product
// will have its own timeoutId. So an object lets us
// save multiple timeout ids for different products.
// For example:
// {
//   'product-id1': 2,
//   'product-id2': 5,
//   ...
// }
// (2 and 5 are ids that are returned when we call setTimeout).
const addedMessageTimeouts = {};

// Function to show 'added' message.
function showAddedMessage(productId) {
  document.querySelector(`.item-${productId}`).classList.add('added-to-cart-visible');
  setTimeout(() => {
    const previousTimeoutId = addedMessageTimeouts[productId];

    if(previousTimeoutId)
      clearTimeout(previousTimeoutId);

    const timeoutId = setTimeout(() => {
      document.querySelector(`.item-${productId}`).classList.remove('added-to-cart-visible');
    }, 1000)

    addedMessageTimeouts[productId] = timeoutId;
  });
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    // To uniquely identify each item
    const productId = button.dataset.productId;

    // Item quantity to be added into the cart.
    let itemQuantity = document.querySelector(`.js-quantity-selector-${productId}`).value;
    // itemQuantity is string. Converting it into an integer.
    itemQuantity = Number(itemQuantity);
    
    // Add items to the cart
    addToCart(productId, itemQuantity);

    // rendering the updated value of the cart
    // Importing the function from cart.js
    updateCartQuantity();

    // showing the 'added' message for a few seconds and then removing it.
    showAddedMessage(productId);
  });
});