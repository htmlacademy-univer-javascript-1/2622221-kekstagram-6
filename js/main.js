import { loadPhotos } from './api.js';
import { renderThumbnails } from './thumbnail.js';
import { initFilters } from './filters.js';
import './form-validation.js';

const showLoadError = () => {
  const errorBlock = document.createElement('div');
  errorBlock.style.padding = '20px';
  errorBlock.style.textAlign = 'center';
  errorBlock.textContent = 'Не удалось загрузить фотографии. Попробуйте позже.';
  document.querySelector('.pictures').append(errorBlock);
};

const initApp = () => {
  loadPhotos()
    .then((photos) => {
      renderThumbnails(photos);
      initFilters(photos, renderThumbnails);
    })
    .catch(() => {
      showLoadError();
    });
};

document.addEventListener('DOMContentLoaded', initApp);
