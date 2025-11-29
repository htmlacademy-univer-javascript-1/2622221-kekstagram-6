
import { debounce } from './util.js';

const filtersContainer = document.querySelector('.img-filters');
const filterButtons = filtersContainer.querySelectorAll('.img-filters__button');

let currentFilter = 'filter-default';

const sortByComments = (photoA, photoB) => photoB.comments.length - photoA.comments.length;

const getFilteredPhotos = (photos, filterType) => {
  switch (filterType) {
    case 'filter-random':
      return [...photos].sort(() => Math.random() - 0.5).slice(0, 10);
    case 'filter-discussed':
      return [...photos].sort(sortByComments);
    default:
      return [...photos];
  }
};

const initFilters = (photos, renderCallback) => {
  filtersContainer.classList.remove('img-filters--inactive');

  const onFilterChange = debounce((filterType) => {
    const filteredPhotos = getFilteredPhotos(photos, filterType);

    filterButtons.forEach((button) => {
      button.classList.toggle('img-filters__button--active', button.id === filterType);
    });

    currentFilter = filterType;
    renderCallback(filteredPhotos);
  });

  filtersContainer.addEventListener('click', (evt) => {
    const button = evt.target.closest('.img-filters__button');
    if (button && button.id !== currentFilter) {
      onFilterChange(button.id);
    }
  });
};

export { initFilters };
