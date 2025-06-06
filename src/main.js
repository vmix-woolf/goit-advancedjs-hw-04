import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast';

const refs = {
  form: document.querySelector('.form'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.js-load-more'),
  loader: document.querySelector('.loader'),
}

let currentQuery = '';
let currentPage = 1;
const perPage = 15;
let totalHits = 0;

hideLoadMore();

refs.form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = refs.form.elements.query.value.trim();
  if (!query) return;

  currentQuery = query;
  currentPage = 1;
  refs.gallery.innerHTML = '';
  showLoader();

  try {
    const data = await fetchImages(query, currentPage, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);
    if (data.hits.length === perPage && totalHits > perPage) {
      showLoadMore();
    }
  } catch (error) {
    iziToast.error({
      message: `Request failed: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

refs.loadMoreButton.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await fetchImages(currentQuery, currentPage, perPage);
    renderGallery(data.hits);
    scrollPage();

    const totalLoaded = currentPage * perPage;
    if (totalLoaded >= totalHits) {
      hideLoadMore();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      message: `Request failed: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

function scrollPage() {
  const firstCard = refs.gallery.querySelector('.gallery-item'); // если обёрнуто в li
  if (firstCard) {
    const cardHeight = firstCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

function showLoader() {
  refs.loader.classList.remove('hidden');
}

function hideLoader() {
  refs.loader.classList.add('hidden');
}

function showLoadMore() {
  refs.loadMoreButton.classList.remove('hidden');
}

function hideLoadMore() {
  refs.loadMoreButton.classList.add('hidden');
}
