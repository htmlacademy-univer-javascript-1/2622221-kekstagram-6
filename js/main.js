import { generatePhotosArray } from './data.js';
import { renderThumbnails } from './thumbnail.js';

const photos = generatePhotosArray;
renderThumbnails(photos);
