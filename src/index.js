import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Notify.success('Whooray!');

const form = document.querySelector('.search-form');

async function fetchImiges() {

    const BASE_URL = 'https://pixabay.com/api/'; 
    const API_KEY = '38385479-57784bf7d17c856b0f296bf8b';
    const query = `${form.elements.searchQuery.value}`
const options = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    }
    const responce = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=${options.image_type}&safesearch=${options.safesearch}`);
    return responce;
}


form.addEventListener('submit', onSubmit);

 async function onSubmit(e) {
     e.preventDefault(); 
     
    const query = await e.target.elements.searchQuery.value;
    console.log(query);
    fetchImiges().then(data => console.log(data))
}