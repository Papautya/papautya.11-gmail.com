import { API_KEY, BASE_URL, API_URL, IMG_URL, searchURL, genres } from './config.js';
// Funciones para manejar la interfaz de usuario
const tagsEl = document.getElementById('tags');

export function setGenre() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.id = genre.id;
        tagElement.innerText = genre.name;
        
        tagElement.addEventListener('click', () => {
            toggleGenreSelection(genre.id);
            getMovies(`${API_URL}&with_genres=${encodeURI(selectedGenre.join(','))}`);
            highlightSelection();
        });
        
        tagsEl.append(tagElement);
    });
}

export function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => tag.classList.remove('highlight'));
    clearBtn();

    if (selectedGenre.length !== 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        });
    }
}

export function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : 'http://via.placeholder.com/1080x1580'}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button>
            </div>
        `;

        main.appendChild(movieEl);

        // Event listener for "Know More" button
        document.getElementById(id).addEventListener('click', () => {
            openNav(movie);
        });
    });
}

export function openNav(movie) {
    const id = movie.id;
    fetch(`${BASE_URL}/movie/${id}/videos?${API_KEY}`)
        .then(res => res.json())
        .then(videoData => {
            if (videoData) {
                document.getElementById("myNav").style.width = "100%";
                displayVideos(videoData.results, movie.original_title);
            }
        })
        .catch(err => console.error('Error fetching video data:', err));
}

export function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}