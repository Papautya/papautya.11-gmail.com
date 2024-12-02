// Funciones para manejar las solicitudes a la API
export async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

export function getMovieVideos(id) {
    return fetch(`${BASE_URL}/movie/${id}/videos?${API_KEY}`)
        .then(res => res.json())
        .catch(err => console.error('Error fetching video data:', err));
}
