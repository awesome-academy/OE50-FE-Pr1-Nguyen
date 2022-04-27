// const progressBar = document.querySelector('#progressbar');
// const prev = document.querySelector('.prev');
// const next = document.querySelector('.next-button');
// const step = document.querySelectorAll('.step0');
// let currentActive = 1;
// next.addEventListener('click', () => {
//   currentActive = currentActive + 2;
//   if (currentActive > progressBar.length) {
//     currentActive = progressBar.length;
//   }
//   // update();
// });
// prev.addEventListener('click', () => {
//   currentActive--;
//   if (currentActive < 1) {
//     currentActive = 1;
//   }
//   update();
// });
// document.onreadystatechange = function update() {
//   step.forEach((step0, index) => {
//     if (index < currentActive) {
//       step0.classList.add('active');
//     } else {
//       step0.classList.remove('active');
//     }
//   });
// };
