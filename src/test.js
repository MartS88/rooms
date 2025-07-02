//
// const array = [Promise.resolve(1), Promise.resolve(2)]
//   [Promise.reject(3), Promise.resolve(4)]
//   [Promise.reject(5), Promise.reject(6)]
//
// //
//   // Реализуйте функцию resolver, на вход которой поступает массив промисов, а на выходе — новый промис, работающий по следующим правилам:
//   //
//   // Если в массиве есть успешно выполняемый промис — возвращаем новый промис с результатом этого промиса.
//   //
//   // Если массив состоит только из промисов, которые завершаются с ошибкой (reject), то необходимо вернуть новый промис, где в reject передаём массив ошибок всех промисов.
//   //
//   // Т.е. задача — агрегировать все ошибки массива промисов в один промис.
//
// function resolver(promises) {
// return new Promise((resolve, reject) => {
//   const errors = []
//   let pending = promises.length
//
//   if (pending === 0) {reject([])}
//
//   for (const p of promises) {
//     p.then(result => {
//       resolve(result);
//     }).catch(err => {
//       errors.push(err);
//       pending--;
//       if (pending === 0) {
//         reject(errors);
//       }
//     });
//   }
// });
//
//
//
//
// }
//
// console.log('resolver',resolver(array));


// async function handleOrders(orders) {
//   const results = await Promise.allSettled(
//     orders.map((order) => processOrder(order))
//   );
//
//   results.forEach((result, index) => {
//     console.log('res',result);
//     if (result.status === 'fulfilled') {
//       successfulOrders.push(`${result.value}`);
//     }
//   });
//
//   console.log(`"Successfully handled ${successfulOrders.length} orders`);
// }
// function getRandomSubset(arr, percent) {
//   const count = Math.floor(arr.length * percent / 100);
//   const shuffled = [...arr].sort(() => Math.random() - 0.5);
//   return shuffled.slice(0, count);
// }
//
//
// const events = [
//   { id: 1, message: 'Drink water', timeout: 1000 },
//   { id: 2, message: 'Stretch your legs', timeout: 2500 },
//   { id: 3, message: 'Look away from the screen', timeout: 1500 },
// ];
//
// const completed = []
// const failed = []
//
// function delay(returnValue, ms) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(returnValue);
//     }, ms);
//   });
// }
//
// const processOrder = async (order, ms) => {
//   await delay(order, ms);
//   if (ms >= order.timeout ) {
//     return `✅ completed: ${order.message}`;
//   }
//   throw new Error(`❌ failed: ${order.message}`);
//
// };
//
//
// async function notifyEvent(array, ms) {
//   const results = await Promise.allSettled(
//     array.map((event) => processOrder(event, ms),
//     ));
//
//   results.forEach((result) => {
//
//     if (result.status === 'fulfilled') {
//       console.log(result.value);
//     }
//     if (result.status === 'rejected') {
//       console.log(result.reason.message);
//     }
//   })
//   console.log(`Всего успешно: ${completed.length}`);
//   console.log(`Всего просрочено: : ${failed.length}`);
// }
//
// await notifyEvent(events, 3100);



const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
//[1, 2, 5, 6]

function sort(arr1,arr2){
for (let i = 0; i < arr1.length; i++) {
  if (arr1[i] === arr2[i]) {
    arr1[i] = 0
  }
}
return arr1
}

console.log('arr,',sort(arr1,arr2));