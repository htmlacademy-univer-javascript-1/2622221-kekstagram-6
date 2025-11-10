import { generatePhotosArray } from './data.js';
import { renderThumbnails } from './thumbnail.js';

// Остаётся без изменений
const photos = generatePhotosArray;
renderThumbnails(photos);
