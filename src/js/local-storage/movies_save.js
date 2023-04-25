import { getMovieForLib } from '../api/movies';

// const saveToWatchedOrQueue = (key, id) => {
//   let value = [];
//   getMovieForLib(id).then(data => {
//     try {
//       if (!localStorage.getItem(key)) {
//         value.push(data);
//         localStorage.setItem(key, JSON.stringify(value));
//       } else {
//         value = JSON.parse(localStorage.getItem(key));
//         // console.log(value);
//         // console.log(data.id);
//         if (value.findIndex(val => val.id === data.id) < 0) {
//           value.push(data);
//           localStorage.setItem(key, JSON.stringify(value));
//         } else {
//           // TO DO: notiflix
//           console.log('OOOOOOPPPS');
//         }
//       }
//     } catch (error) {
//       console.error('Set state error: ', error.message);
//     }
//   });
// };

const saveToWatchedOrQueue = (key1, key2, id) => {
  let value1 = [];
  let value2 = [];
  getMovieForLib(id).then(data => {
    try {
      if (!localStorage.getItem(key1) && !localStorage.getItem(key2)) {
        value1.unshift(data);
        localStorage.setItem(key1, JSON.stringify(value1));
      } else if (!localStorage.getItem(key1) && localStorage.getItem(key2)) {
        value2 = JSON.parse(localStorage.getItem(key2));
        if (value2.findIndex(val => val.id === data.id) < 0) {
          console.log(value2.findIndex(val => val.id === data.id));
          value1.unshift(data);
          localStorage.setItem(key1, JSON.stringify(value1));
        } else {
          value2.splice(
            value2.findIndex(val => val.id === data.id),
            1,
          );
          console.log('drugi ma ten sam film');
          localStorage.setItem(key2, JSON.stringify(value2));
          value1.unshift(data);
          localStorage.setItem(key1, JSON.stringify(value1));
        }
      } else {
        value1 = JSON.parse(localStorage.getItem(key1));
        value2 = JSON.parse(localStorage.getItem(key2));

        // console.log(value);
        // console.log(data.id);
        if (value2) {
          const ind1 = value1.findIndex(val => val.id === data.id);
          const ind2 = value2.findIndex(val => val.id === data.id);
          if (ind1 < 0 && ind2 < 0) {
            value1.unshift(data);
            localStorage.setItem(key1, JSON.stringify(value1));
          } else if (ind2 >= 0) {
            value2.splice(ind2, 1);
            localStorage.setItem(key2, JSON.stringify(value2));
            value1.unshift(data);
            localStorage.setItem(key1, JSON.stringify(value1));
          } else {
            // TO DO: notiflix
            console.log('OOOOOOPPPS');
          }
        } else {
          if (value1.findIndex(val => val.id === data.id) < 0) {
            value1.unshift(data);
            localStorage.setItem(key1, JSON.stringify(value1));
          } else {
            // TO DO: notiflix
            console.log('OOOOOOPPPS');
          }
        }
      }
    } catch (error) {
      console.error('Set state error: ', error.message);
    }
  });
};

export default saveToWatchedOrQueue;
