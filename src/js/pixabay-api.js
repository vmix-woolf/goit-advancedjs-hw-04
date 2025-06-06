const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '50620942-86f2c97479190741e85e85db7';

export function fetchImages(query) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  const url = `${BASE_URL}?${new URLSearchParams(params)}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
}
