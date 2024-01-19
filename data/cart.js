// Export keyword is used to export the variables to other files
// Data type is 'let' because in 'chackout.js' we are updating the cart with 'newCart'.
export let cart = JSON.parse(localStorage.getItem('cart'));

if(cart === null) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 1
    }, 
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 2
    }
  ];
}

// Function to save the cart in Local Storage
function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to Add items to the cart.
// We are using product IDs to add them into the cart to
// identify each item distinctly.
export function addToCart(productId, itemQuantity) {
  // checking if the product is already in the cart.
  // if not, add it.
  // if it is, increase the quantity
  let matchingItem;
  cart.forEach((cartItem) => {
    if(cartItem.productId === productId)
      matchingItem = cartItem;
  });

  if(matchingItem) {
    // Increasing the quantity by the value of the selector
    matchingItem.quantity += itemQuantity;
  } else {
    cart.push({
      productId: productId,
      // Setting the quantity by the value of the selector
      quantity: itemQuantity
    });
  }

  saveToLocalStorage();
}

// Function to remove items from the cart
export function removeFromCart(productId) {
  let newCart = [];
  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId)
      newCart.push(cartItem);
  });
  // updating the cart to the newCart.
  cart = newCart;

  saveToLocalStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if(cartItem.productId === productId)
      matchingItem = cartItem;
  });

  matchingItem.quantity = newQuantity;

  saveToLocalStorage();
}