import { generatePhotosArray } from './data.js';

const createThumbnailElement = (photo) => {
  const template = document.querySelector('#picture');
  const thumbnailElement = template.content.cloneNode(true);
  const pictureLink = thumbnailElement.querySelector('.picture');
  const pictureImg = thumbnailElement.querySelector('.picture__img');
  const pictureComments = thumbnailElement.querySelector('.picture__comments');
  const pictureLikes = thumbnailElement.querySelector('.picture__likes');

  pictureImg.src = photo.url;
  pictureImg.alt = photo.description;
  pictureComments.textContent = photo.comments.length;
  pictureLikes.textContent = photo.likes;
  pictureLink.dataset.thumbnailId = photo.id;
  return thumbnailElement;
};

const renderThumbnails = () => {
  const picturesContainer = document.querySelector('.pictures');
  const photos = generatePhotosArray();
  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    const thumbnailElement = createThumbnailElement(photo);
    fragment.appendChild(thumbnailElement);
  });
  picturesContainer.innerHTML = '';
  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };
