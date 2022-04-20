const listProduct = document.querySelector('.js-product-list');
const gridProduct = document.querySelector('.js-product-grid');
const menuCategory = document.querySelector('.js-filter__nav');
const pagination = document.querySelector('.pagination');
const cartList = document.querySelector('.cart__table');
const cartQuantity = document.querySelector('.cart-shopping__quantity');
let filterApplied = {};
let menu = [];
let products = [];
let currentPage = 1;
let totalProduct = 0;
let cart = [];
class Api {
  getProduct = async function (page = 1, limit = 9) {
    try {
      const res = await fetch(
        `http://localhost:3000/product?_page=${page}&_limit=${limit}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(res.statusText);
      products = data;
      totalProduct = res.headers.get('X-Total-Count');
      return products;
    } catch (err) {
      alert(err.message);
    }
  };

  getProductByCategory = async function (category, page = 1, limit = 9) {
    const view = new View();
    try {
      const res = await fetch(
        `http://localhost:3000/product?category=${category}&_page=${page}&_limit=${limit}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(res.statusText);
      totalProduct = res.headers.get('X-Total-Count');
      products = data;
      pagination.innerHTML = '';
      view.renderPagination(totalProduct);
      return products;
    } catch (err) {
      alert(err.message);
    }
  };

  getSidebar = async function () {
    try {
      const res = await fetch(`http://localhost:3000/menu`);
      const data = await res.json();
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      menu = data;
      return menu;
    } catch (err) {
      alert(err.message);
    }
  };

  getProductByPage = async function (page, limit) {
    try {
      const res = await fetch(
        `http://localhost:3000/product?_page=${page}&_limit=${limit}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(res.statusText);
      products = data;
    } catch (err) {
      alert(err.message);
    }
  };

  getProductByCategoryPage = async function (category, page, limit) {
    try {
      const res = await fetch(
        `http://localhost:3000/product?category=${category}&_page=${page}&_limit=${limit}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(res.statusText);
      products = data;
    } catch (err) {
      alert(err.message);
    }
  };
}

class View {
  initialApp() {
    cart = Storage.getCart();
    this.renderCartQuantity();
  }

  //cart

  renderCartQuantity() {
    let totalQuantity = cart.reduce((total, item) => total + item.amount, 0);
    cartQuantity.textContent = totalQuantity;
  }

  getProductById(id) {
    return products.find((product) => product.id === id);
  }

  productList(product) {
    return `
    <div class="col-12" id=${product.id}>
        <div class="product-list"> 
            <div class="product-list__img"><img class="product-list__img" src=${product.src} alt =""/>
                <div class="product-list__tag"><span class="product__tag--new">sale</span></div>
            </div>
            <div class="product-list__body">  
                <h2 class="product-list__title">${product.title}</h2>
                <p class="product-list__price">${product.price}</p>
                <p class="product-list__txt">${product.desc}</p>
                <div class="product-list__more"> <a class="bag-button btn button btn--black" data-id=${product.id}>Add to card</a>
                    <div class="product-list__status"> 
                        <div class="product__love"> <i class="fa fa-heart"></i>
                            <p class="product__txt">Yêu thích</p>
                        </div>
                        <div class="product__compare"> <i class="fa fa-heart"></i>
                            <p class="product__txt">So sánh</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>             
    </div>
    `;
  }

  productGrid(product) {
    return `
         <div class="col-lg-4 col-md-6 col-12" id=${product.id}>
             <div class="product text-center">
                 <div class="product__img">
                     <img class="product__img" src=${product.src} alt ="" />
                         <div class="product__tag">
                                 <span class="product__tag--new">sale</span>
                          </div>
                     </div>
                         <div class="product__more">
                             <div class="product__love">
                                 <i class="fa fa-heart"></i>
                                 <p class="product__txt">Yêu thích</p>
                             </div>
                             <div class="product__compare">
                                 <i class="fa fa-heart"></i>
                                 <p class="product__txt">So sánh</p>
                             </div>
                             <div class="product__zoom">
                                 <i class="fa fa-heart"></i>
                             </div>
                     </div>
                     <div class="product__body">
                         <h2 class="product__title">${product.title}</h2>
                         <p class="product__price">
                                 <span class="product__price-sale">${product.price}</span
                                 ><span class="product__price-cost"
                                   >${product.sale}</span
                                 >
                         </p>
                     </div>
                    <a class="bag-button btn button btn--black">Add to card</a>
                 </div>
          </div>
    
         `;
  }

  renderProduct(products) {
    products.map((product) => {
      listProduct.insertAdjacentHTML('beforeend', this.productList(product));
      gridProduct.insertAdjacentHTML('beforeend', this.productGrid(product));
    });
  }

  renderProductsByPage = function (action) {
    const paginationBtn = document.querySelectorAll('.page-link');
    paginationBtn.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        await action(Number(btn.dataset.page), 6);
        currentPage = btn.dataset.page;
        listProduct.innerHTML = '';
        gridProduct.innerHTML = '';
        this.renderProduct(products);
      });
    });
  };

  renderProductsByCategoryPage = function (action) {
    const paginationBtn = document.querySelectorAll('.page-link');
    paginationBtn.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        await action(filterApplied, Number(btn.dataset.page), 6);
        currentPage = btn.dataset.page;
        listProduct.innerHTML = '';
        gridProduct.innerHTML = '';
        this.renderProduct(products);
      });
    });
  };

  ///FILTER

  renderSidebar(menu) {
    for (const [key, value] of Object.entries(menu)) {
      menuCategory.insertAdjacentHTML(
        'beforeend',
        `<ul class="filter__category-list pt-3 ${key}">
          <a class="nav__link nav__link--black" href="#" >${value['title']}</a>
        </ul>`
      );
      value['list'].map((val) => {
        document.querySelector(`.${key}`).insertAdjacentHTML(
          'beforeend',
          `<li class="filter__category-item">
              <a class="filter__category-link" data-category=${val}>${val}</a>
            </li>`
        );
      });
    }
  }

  renderProductsByCategory = function (action) {
    const categoryBtn = document.querySelectorAll('.filter__category-link');
    categoryBtn.forEach((btn) => {
      btn.addEventListener('click', async () => {
        let category = btn.dataset.category;
        let data = await action(category);
        listProduct.innerHTML = '';
        gridProduct.innerHTML = '';
        filterApplied = category;
        this.renderProduct(products);
        btn.classList.add('filter__category-link--active');
        categoryBtn.forEach((btn) => {
          if (btn.dataset.category !== category) {
            btn.classList.remove('filter__category-link--active');
          }
        });
      });
    });
  };

  //Pagination

  renderPagination = function (total) {
    const api = new Api();
    let totalPage = Math.ceil(total / 6);
    for (let i = 1; i <= totalPage; i++) {
      let pageHTML = `
      <li class="page-item"> 
        <a class="page-link" data-page=${i}>${i}</a>
      </li>
      `;
      pagination.insertAdjacentHTML('beforeend', pageHTML);
    }
    this.renderProductsByPage(api.getProductByPage);
    this.renderProductsByCategoryPage(api.getProductByCategoryPage);
  };

  addCartButton() {
    const bagButton = [...document.querySelectorAll('.bag-button')];
    bagButton.map((button) => {
      const productId = button.dataset.id;
      button.addEventListener('click', (e) => {
        const inCart = Storage.getCart().find((item) => item.id === productId);
        if (inCart) {
          let tempItem = cart.find((item) => item.id === productId);
          tempItem.amount += 1;
          Storage.saveCart(cart);
        } else {
          const cartItem = { ...this.getProductById(productId), amount: 1 };
          cart = [...cart, cartItem];
          Storage.saveCart(cart);
        }
        this.renderCartQuantity();
      });
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
  const api = new Api();
  const view = new View();
  view.initialApp();

  api
    .getProduct(1, 6)
    .then((products) => {
      view.renderProduct(products);
      view.renderProductsByPage(api.getProductByPage);
    })
    .then(() => {
      view.addCartButton();
      view.renderPagination(totalProduct);
    });

  api.getSidebar().then((menu) => {
    view.renderSidebar(menu);
    view.renderProductsByCategory(api.getProductByCategory);
    view.renderProductsByPage(api.getProductByPage);
  });
});
