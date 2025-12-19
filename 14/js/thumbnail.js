import { openBigPicture } from './big-picture.js';

const container = document.querySelector('.pictures');

const clearThumbnails = () => {
  const thumbnails = container.querySelectorAll('.picture');
  thumbnails.forEach((thumbnail) => thumbnail.remove());
};

const createThumbnailElement = (photoData) => {
  const template = document.querySelector('#picture');
  const thumbnail = template.content.querySelector('.picture').cloneNode(true);

  const img = thumbnail.querySelector('.picture__img');
  img.src = photoData.url;
  img.alt = photoData.description;

  thumbnail.querySelector('.picture__likes').textContent = photoData.likes;
  thumbnail.querySelector('.picture__comments').textContent = photoData.comments.length;

  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(photoData);
  });

  return thumbnail;
};

const renderThumbnails = (photos) => {
  clearThumbnails();

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.appendChild(createThumbnailElement(photo));
  });

  container.appendChild(fragment);
};

export { renderThumbnails };
