import { getMovieForLib } from '../api/movies';
import Notiflix from 'notiflix';

// GET MOVIES FROM LOCALSTORAGE

const getMoviesFromLib = key => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
};

/** SAVE TO WATCHED OR QUEUE. 
 * 
 * Allows to add movie to one storage key and remove from another (if already exist) simultaneously.
Each of two local storage keys (watched or queue|key1 or key2) has an arrow of movies data (value1| value2).
Before saving new movie data to one of the keys check if that movie already exists in another one.
If it does exist remove it. One movie can exist only in one of two keys at the same time.
*/
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
          value1.unshift(data);
          localStorage.setItem(key1, JSON.stringify(value1));
        } else {
          value2.splice(
            value2.findIndex(val => val.id === data.id),
            1,
          );
          localStorage.setItem(key2, JSON.stringify(value2));
          value1.unshift(data);
          localStorage.setItem(key1, JSON.stringify(value1));
        }
      } else {
        value1 = JSON.parse(localStorage.getItem(key1));
        value2 = JSON.parse(localStorage.getItem(key2));

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
            Notiflix.Notify.init({
              info: {
                background: 'orange',
                notiflixIconColor: 'white',
              },
            });
            Notiflix.Notify.info(`The movie already exists in the "${key1}" library`, {
              position: 'center-center',
            });
            console.log('OOOOOOPPPS');
          }
        } else {
          if (value1.findIndex(val => val.id === data.id) < 0) {
            value1.unshift(data);
            localStorage.setItem(key1, JSON.stringify(value1));
          } else {
            Notiflix.Notify.init({
              info: {
                background: 'orange',
                notiflixIconColor: 'white',
              },
            });
            Notiflix.Notify.info(`The movie already exists in the "${key1}" library`, {
              position: 'center-center',
            });
            console.log('OOOOOOPPPS');
          }
        }
      }
    } catch (error) {
      console.error('Set state error: ', error.message);
    }
  });
};

export { saveToWatchedOrQueue, getMoviesFromLib };
