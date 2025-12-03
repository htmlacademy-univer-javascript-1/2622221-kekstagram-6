
import { photos } from './data.js';
import { renderThumbnails } from './thumbnail.js';
import { initFilters } from './filters.js';
import './form-validation.js';

const initApp = () => {
  renderThumbnails(photos);
  initFilters(photos, renderThumbnails);
};

document.addEventListener('DOMContentLoaded', initApp);
