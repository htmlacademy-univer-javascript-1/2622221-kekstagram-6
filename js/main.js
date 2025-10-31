
import { generatePhotosArray } from './data.js';
import { renderThumbnails } from './thumbnail.js';

const initializeApp = () => {
  const photos = generatePhotosArray;
  renderThumbnails(photos);
};

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});
