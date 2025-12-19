const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const loadPhotos = () =>
  fetch(`${BASE_URL}/data`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      return response.json();
    });

const sendPhoto = (formData) =>
  fetch(BASE_URL, {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка отправки данных');
      }
    });

export { loadPhotos, sendPhoto };
