import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38385479-57784bf7d17c856b0f296bf8b';
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
let searchQuery = '';
let counter = 1;

async function fetchImiges() {  
    let page = 1;
    const responce = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&safesearch=true&per_page=40&orientation=horizontal&page=${page}`);
    return responce;
}

form.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();

    gallery.innerHTML = '';
    searchQuery = e.target.elements.searchQuery.value.replaceAll(' ', '+');
    try {
        const resp = await fetchImiges(searchQuery, counter);
        const totalHits = resp.data.totalHits;

        if (!totalHits) {
            throw new Error('Sorry, there are no images matching your search query. Please try again.')
        }

        Notify.success(`Hooray! We found ${totalHits} images.`);

        const markup = resp.data.hits.map( ({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
            return  `<a href="${largeImageURL}" class="photo-card">
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
        }).join('');
        gallery.innerHTML = markup;
    } catch (error) { Notify.failure(error.massage)};
} 
 
