import { API_KEY, BASE_URL, API_URL, IMG_URL, searchURL, genres } from './config.js';
import { fetchMovies, getMovieVideos } from './api.js';
import { setGenre, showMovies, openNav, closeNav } from './ui.js';
import { toggleGenreSelection, updatePaginationButtons, getColor } from './movies.js';

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPages = 100;

let selectedGenre = [];
setGenre();

// Lógica para manejar eventos y controlar el flujo
getMovies(API_URL);
