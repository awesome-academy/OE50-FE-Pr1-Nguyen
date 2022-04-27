const orderCartList = document.querySelector('.order__table-content');
const orderAddress = document.querySelector('.order__info-content');
const orderconfirmContainer = document.querySelector('.order__info');
const backHomebtn = document.querySelector('.order-back-home');
let orderConfirm = [];

class View {
  initialApp() {
    orderConfirm = Storage.getOrderConfirm();
    if (Object.keys(orderConfirm).length == 0) {
      orderconfirmContainer.innerHTML = `<h3>Not new order</h3>`;
    } else {
      this.renderAddress();
      this.renderOrder();
    }
  }

  renderAddress() {
    let addressConfirm = orderConfirm.defaultAddress;
    let addressConfirmHTML = `
        <ul class="mb-3">
        <li><i class="fa fa-user"> </i><span class="desc ps-2">${
          addressConfirm.lastName + ' ' + addressConfirm.name
        } </span></li>
        <li><i class="fa fa-location-arrow"> </i><span class="desc ps-2">${
          addressConfirm.addr + ', ' + addressConfirm.city
        }</span></li>
        <li> <i class="fa fa-phone"> </i><span class="desc ps-2">${
          addressConfirm.phone
        }</span></li>
      </ul>
          `;
    orderAddress.innerHTML = addressConfirmHTML;
  }

  renderOrder() {
    console.log(orderConfirm);
    orderConfirm.cart.map((orderItem) => {
      const orderConfirmHTML = `
      <tr class="table__tr" data-id=${orderItem.id}> 
        <td class="table__td order__td" data-title="STT">1</td>
        <td class="table__td order__td" data-title="Mã hóa đơn/ngày mua hàng">
          <p>Leanhgiang - 17/06/2015</p><span>01:36 14/03/2015</span>
        </td>
        <td class="table__td order__td" data-title="Kho nhận hàng">Hà đông</td>
        <td class="table__td order__td" data-title="Số sp">${
          orderItem.amount
        }</td>
        <td class="table__td order__td" data-title="Tổng tiền">${
          orderItem.amount * orderItem.price + 200000
        } VNĐ</td>
        <td class="table__td order__td text-capitalize" data-title="Tình trạng">Đã thanh toán</td>
        <td class="table__td order__td text-capitalize" data-title="Thao tác"> <a href="">Chi tiết </a></td>
    </tr>
      `;
      orderCartList.insertAdjacentHTML('beforeend', orderConfirmHTML);
    });
  }

  backToHome() {
    backHomebtn.addEventListener('click', () => {
      Storage.deleteOrderConfirm();
      window.location.href = 'http://localhost:3001/';
      alert('Đặt hàng thành công !');
    });
  }
}

class Storage {
  static getOrderConfirm() {
    return localStorage.getItem('newOrder')
      ? JSON.parse(localStorage.getItem('newOrder'))
      : [];
  }

  static deleteOrderConfirm() {
    localStorage.removeItem('newOrder', JSON.stringify('newOrder'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const view = new View();
  view.initialApp();
  view.backToHome();
});

window.addEventListener('beforeunload', () => {
  Storage.deleteOrderConfirm();
});
