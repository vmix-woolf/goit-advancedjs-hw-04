import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast';

const refs = {
  form: document.querySelector('.form'),
  gallery: document.querySelector('.gallery')
}

refs.form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = refs.form.elements.query.value.trim();
  if (!query) return;

  showLoader();
  refs.gallery.innerHTML = '';

  fetchImages(query)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.settings({
          position: 'topRight',
        });
        iziToast.error({
          message: 'Sorry, there are no images matching your search query. Please try again!'
        });

        hideLoader();
        refs.form.elements.query.value = '';
        return;
      }

      renderGallery(data.hits);
      hideLoader();
    })
    .catch(error => {
      hideLoader();
      iziToast.error({
        message: `Request failed: ${error.message}`,
        position: 'topRight',
      });
    });
});

const loader = document.querySelector('.loader');

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}
