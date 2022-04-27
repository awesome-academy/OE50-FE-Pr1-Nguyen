const addressExists = document.querySelector('.address-exist');
const addressDefault = document.querySelector('.address-default');
const checkoutCart = document.querySelector('.checkout-cartlist');
const checkoutSum = document.querySelector('.checkout-sum');
const checkoutTotal = document.querySelector('.checkout-total');
const sendOrderBtn = document.querySelector('.checkout-btn-btn');
const addressListContain = document.querySelector('.address-list');
const addAddressBtn = document.querySelector('.add-address');
const addressInput = document.querySelector('.address__input');
let cart = [];
let addressList = [];
let newAddress = { isDefault: 'true' };
let defaultAddress = {};
let addressDOM = [];
let order = [];
//api
class Api {
  getDefaultAddress = function (list) {
    defaultAddress = list.find((addr) => addr.isDefault === 'true');
  };

  getAddress = async function () {
    try {
      const res = await fetch('http://localhost:3000/address');
      const data = await res.json();
      if (!res.ok) throw new Error(res.statusText);
      addressList = data;
      this.getDefaultAddress(addressList);
    } catch (err) {
      alert(err);
    }
  };

  sendOrder = async function (order) {
    try {
      const res = await fetch('http://localhost:3000/order', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
      Storage.deleteCart();
      Storage.saveNewOrder(order);
      window.location.href = 'http://localhost:3001/order.html';
    } catch (err) {
      alert(err);
    }
  };

  addNewAddress = async function () {
    addAddressBtn.addEventListener('click', async () => {
      try {
        await fetch(`http://localhost:3000/address/${defaultAddress.id}`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isDefault: 'fault' }),
        });
        await fetch(`http://localhost:3000/address`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAddress),
        });
        this.renderAddress();
      } catch (err) {
        console.log(err);
      }
    });
  };

  changeDefaultAddress() {
    const addressBtn = document.querySelectorAll('.address-item');
    addressDOM = addressBtn;
    addressDOM.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const oldDefaultAddress = addressList.find(
          (address) => address.isDefault === 'true'
        );
        try {
          await fetch(
            `http://localhost:3000/address/${btn.dataset.addressid}`,
            {
              method: 'PATCH',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ isDefault: 'true' }),
            }
          );
          await fetch(`http://localhost:3000/address/${oldDefaultAddress.id}`, {
            method: 'PATCH',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isDefault: 'fault' }),
          });
          this.renderAddress();
        } catch (err) {
          alert(err);
        }
      });
    });
  }

  renderAddress = async function () {
    const view = new View();
    const res = await fetch('http://localhost:3000/address');
    const newAddressList = await res.json();
    addressList = newAddressList;
    this.getDefaultAddress(addressList);
    addressDefault.innerHTML = '';
    addressListContain.innerHTML = '';
    view.renderDefaultAddress(
      addressList.filter((address) => address.isDefault === 'true')
    );
    view.renderAddressList(
      addressList.filter((address) => address.isDefault === 'fault')
    );
  };
}

class View {
  initialApp() {
    cart = Storage.getCart();
    this.formInputChange();
  }

  renderDefaultAddress(address) {
    const api = new Api();
    for (const [key, value] of Object.entries(address)) {
      let addressElement = `
                <h2>Địa chỉ mặc định</h2>
                <div class="mb-4 row ${key}">
                  <label class="form-label col-md-3" for="lastName">Tên</label>
                  <div class="col-md-9"><span class="desc">${value.name}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="firstName">Họ &amp; tên đệm</label>
                  <div class="col-md-9"><span class="desc">${value.lastName}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="address">Địa chỉ</label>
                  <div class="col-md-9"><span class="desc">${value.addr}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="city">Thành phố</label>
                  <div class="col-md-9"><span class="desc">${value.city}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="country">Quốc tịch</label>
                  <div class="col-md-9"><span class="desc">${value.nation}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="code">Postal/Zip code</label>
                  <div class="col-md-9"><span class="desc">${value.zipcode}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="phone">Phone</label>
                  <div class="col-md-9"><span class="desc">${value.phone}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <div class="offset-sm-8 col-sm-4"> <a class="address__link address__link--blue address-item" data-addressId=${value.id}>Chỉnh sửa địa chỉ</a></div>
                </div>
      `;
      if (key == 'isDefault' || key == 'id') {
        addressElement = '';
      }
      addressDefault.insertAdjacentHTML('afterbegin', addressElement);
    }
    api.changeDefaultAddress();
  }

  renderAddressList(list) {
    const api = new Api();
    list.map((address) => {
      let addressHTMl = `
              <h2>Địa chỉ </h2>
              <div class="form mt-3 address__info data-addressId =${address.id}">   
                <div class="mb-4 row "> 
                  <label class="form-label col-md-3" for="lastName">Tên</label>
                  <div class="col-md-9"><span class="desc">${address.name}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="firstName">Họ &amp; tên đệm</label>
                  <div class="col-md-9"><span class="desc">${address.lastName}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="address">Địa chỉ</label>
                  <div class="col-md-9"><span class="desc">${address.addr}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="city">Thành phố</label>
                  <div class="col-md-9"><span class="desc">${address.city}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="country">Quốc tịch</label>
                  <div class="col-md-9"><span class="desc">${address.nation}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="code">Postal/Zip code</label>
                  <div class="col-md-9"><span class="desc">${address.zipcode}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <label class="form-label col-md-3" for="phone">Phone</label>
                  <div class="col-md-9"><span class="desc">${address.phone}</span>
                  </div>
                </div>
                <div class="mb-4 row"> 
                  <div class="offset-sm-8 col-sm-4"> <a class="address__link address__link--blue address-item" data-addressId=${address.id}>Chỉnh sửa địa chỉ</a></div>
                </div>
              </div>   
                `;
      addressListContain.insertAdjacentHTML('beforeend', addressHTMl);
    });
    api.changeDefaultAddress();
  }

  formInputChange() {
    const inputName = document.querySelector('#lastName');
    const inputFirstname = document.querySelector('#firstName');
    const inputaddress = document.querySelector('#address');
    const inputphone = document.querySelector('#phone');
    const btnInsert = document.querySelector('.btn-insert');
    btnInsert.addEventListener('click', () => {
      newAddress['name'] = inputName.value;
      newAddress['lastName'] = inputFirstname.value;
      Storage.saveAddress(newAddress);
    });
  }
}

class Storage {
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static saveAddress(address) {
    localStorage.setItem('address', JSON.stringify(address));
  }

  static saveNewOrder(order) {
    localStorage.setItem('newOrder', JSON.stringify(order));
  }

  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }

  static deleteCart() {
    localStorage.removeItem('cart', JSON.stringify('cart'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const api = new Api();
  const view = new View();
  view.initialApp();
  api
    .getAddress()
    .then(() => {
      let defaultAddress = addressList.filter(
        (add) => add.isDefault === 'true'
      );
      let unDefaultAddress = addressList.filter(
        (add) => add.isDefault === 'fault'
      );
      view.renderDefaultAddress(defaultAddress);
      view.renderAddressList(unDefaultAddress);
      api.changeDefaultAddress();
    })
    .then(() => {
      sendOrderBtn.addEventListener('click', () => {
        if (cart.length > 0) {
          api.sendOrder({ cart, defaultAddress });
        }
      });
    });

  api.addNewAddress();
});
