import { Promise } from 'core-js';
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Retriving and sending JSON to and from API. Refactored getJSON and sendJSON
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          // Headers are snippets of text representing information about request itself
          headers: {
            'Content-Type': 'application/json',
          },
          // Date we want to send. In this case it has to be JSON
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}(${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

// // retriving JSON from API
// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message}(${res.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// // sending JSON to API
// export const sendJSON = async function (url, uploadData) {
//   try {
//     // to send data to url the fetch has to cantain additional object with options
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       // Headers are snippets of text representing information about request itself
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       // Date we want to send. In this case it has to be JSON
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message}(${res.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
