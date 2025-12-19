import { debounce } from './util.js';

const filtersContainer = document.querySelector('.img-filters');
const filterButtons = filtersContainer.querySelectorAll('.img-filters__button');

let currentFilter = 'filter-default';

const sortByComments = (a, b) => b.comments.length - a.comments.length;

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

const initFilters = (photos, renderThumbnails) => {
  filtersContainer.classList.remove('img-filters--inactive');

  const debouncedRender = debounce((filterType) => {
    renderThumbnails(getFilteredPhotos(photos, filterType));
  }, 500);

  filtersContainer.addEventListener('click', (evt) => {
    const button = evt.target.closest('.img-filters__button');
    if (!button || button.id === currentFilter) {
      return;
    }

    filterButtons.forEach((btn) =>
      btn.classList.remove('img-filters__button--active')
    );
    button.classList.add('img-filters__button--active');

    currentFilter = button.id;
    debouncedRender(currentFilter);
  });
};

export { initFilters };
