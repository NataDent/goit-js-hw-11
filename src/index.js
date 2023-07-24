import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38385479-57784bf7d17c856b0f296bf8b';
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more')
}
const lightbox = new SimpleLightbox('.gallery a', { showCounter: false });

// let counter = 1;
let page = 1;
let searchQuery = '';

async function fetchImiges() {  
    const responce = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&safesearch=true&per_page=40&orientation=horizontal&page=${page}`);
    return responce;
}

refs.form.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();
    refs.gallery.innerHTML = '';
    page = 1;
    searchQuery = e.target.elements.searchQuery.value.replaceAll(' ', '+');
    try {
        const resp = await fetchImiges(searchQuery, page);
        const totalHits = resp.data.totalHits;

        if (!totalHits) {
            throw new Error('Sorry, there are no images matching your search query. Please try again.')
        }

        Notify.success(`Hooray! We found ${totalHits} images.`);

      const markup = resp.data.hits.map(createMurkup).join('');
      
      refs.gallery.innerHTML = markup;
      refs.loadMore.style.display = 'block';
      lightbox.refresh();
      
      
  } catch (error) {
      Notify.failure(error.message);
      e.target.reset();
  };
} 



 function createMurkup({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) {
  return `<a href="${largeImageURL}" class="photo-card">
  <div class="img-container"><img class="card-img" src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <span class="text-number">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b> <span class="text-number">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b> <span class="text-number">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b> <span class="text-number">${downloads}</span>
    </p>
  </div>
</a>`
}

counter = 1;
refs.loadMore.addEventListener('click', onLoadMore);
lightbox.refresh();

async function onLoadMore() {
  lightbox.refresh();
  try {
    page += 1;
    searchQuery = refs.form.elements.searchQuery.value;
    const resp = await fetchImiges(searchQuery, page);
    const markup = resp.data.hits.map(createMurkup).join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup);
    
    console.dir(resp);
    refs.loadMore.style.display = 'block';
    lightbox.refresh();
  } catch (err) {
    Notify.failure(err.message);
  }
}
