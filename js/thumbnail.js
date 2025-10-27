import { createPhotos } from './data.js';

const createThumbnailElement = (photo) => {
  const template = document.querySelector('#picture');
  const thumbnailElement = template.content.cloneNode(true);

  const pictureImg = thumbnailElement.querySelector('.picture__img');
  const pictureComments = thumbnailElement.querySelector('.picture__comments');
  const pictureLikes = thumbnailElement.querySelector('.picture__likes');

  pictureImg.src = photo.url;
  pictureImg.alt = photo.description;
  pictureComments.textContent = photo.comments.length;
  pictureLikes.textContent = photo.likes;

  return thumbnailElement;
};

const renderThumbnails = () => {
  const picturesContainer = document.querySelector('.pictures');

  const fragment = document.createDocumentFragment();

  const exportPhotos = createPhotos();
  exportPhotos.forEach((photo) => {
    const thumbnailElement = createThumbnailElement(photo);
    fragment.appendChild(thumbnailElement);
  });

  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };
