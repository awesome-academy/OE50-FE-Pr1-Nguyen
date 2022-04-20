const cartList = document.querySelector('.cart__table-content');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const clearCartBtn = document.querySelector('.cart-clear');
const updateCartBtn = document.querySelector('.cart-update');
let cart = [];
let cartItemEvent = [];

class View {
  initialApp() {
    cart = Storage.getCart();
    this.setCartValues();
  }

  setCartValues() {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartItems.innerText = `Tổng số tiền lượng sản phẩm : ${itemsTotal}`;
    cartTotal.innerText = `Tổng số tiền  : ${tempTotal}`;
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues();
    Storage.saveCart(cart);
  }

  clearCart() {
    cart = [];
    this.setCartValues();
    Storage.saveCart(cart);
    cartList.innerHTML = '';
  }

  renderCart() {
    cart.map((cartItem) => {
      const cartHTML = `
          <tr class="table__tr cart-item" data-id=${cartItem.id}> 
            <td class="table__td" data-title="Ảnh"><img class="table__img" src="${
              cartItem.src
            }" alt=""></td>
            <td class="table__td" data-title="Tên Sản Phẩm">${
              cartItem.title
            }</td>
            <td class="table__td table__price" data-title="Giá">${
              cartItem.price
            } VND</td>
            <td class="table__td" data-title="Số lượng">
              <i class="fa fa-plus cart-up" data-id=${cartItem.id}></i>  
              <span class="px-3  table__amount" data-id=${cartItem.id} >${
        cartItem.amount
      }</span>
              <i class="fa fa-minus cart-down" data-id=${cartItem.id}></i> 
            </td>
            <td class="table__td table__total" data-title="Tổng số" data-id=${
              cartItem.id
            }>${cartItem.price * cartItem.amount} VNĐ</td>
            <td class="table__td" data-title="Xóa" data-id=${cartItem.id}> 
                <button class="delete-product btn button" data-id=${
                  cartItem.id
                }><i class="fa fa-trash" ></i></button>
            </td>
        </tr>
          `;
      cartList.insertAdjacentHTML('beforeend', cartHTML);
    });
  }

  updateCart(productId, amount, total) {
    const itemAmountList = [...document.querySelectorAll('.table__amount')];
    const itemSumList = [...document.querySelectorAll('.table__total')];
    itemAmountList.forEach((item) => {
      if (item.dataset.id === productId) {
        item.innerText = amount;
      }
    });
    itemSumList.forEach((item) => {
      if (item.dataset.id === productId) {
        item.innerText = `${total} VNĐ`;
      }
    });
  }

  cartLoad() {
    clearCartBtn.addEventListener('click', () => {
      this.clearCart();
    });
    cartList.addEventListener('click', (e) => {
      const controlBtn = e.target;
      const productId = controlBtn.dataset.id;
      let tempItem = cart.find((item) => item.id === productId);
      if (e.target.classList.contains('cart-up')) {
        tempItem.amount += 1;
        this.setCartValues(cart);
        let tempTotal = tempItem.amount * tempItem.price;
        Storage.saveCart(cart);
        this.updateCart(productId, tempItem.amount, tempTotal);
      }
      if (e.target.classList.contains('cart-down')) {
        tempItem.amount -= 1;
        let tempTotal = tempItem.amount * tempItem.price;
        if (tempItem.amount > 0) {
          this.setCartValues(cart);
        } else {
          cartList.removeChild(controlBtn.parentElement.parentElement);
          this.removeItem(productId);
        }
        Storage.saveCart(cart);
        this.updateCart(productId, tempItem.amount, tempTotal);
      }
      if (e.target.classList.contains('delete-product')) {
        const trashBtn = document.querySelector('.delete-product');
        cartList.removeChild(trashBtn.parentElement.parentElement);
        this.removeItem(productId);
      }
    });
  }
}

class Storage {
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const view = new View();

  view.initialApp();
  view.cartLoad();
  view.renderCart();
});
