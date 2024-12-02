// Funciones relacionadas con la lógica de las películas
export function toggleGenreSelection(genreId) {
    if (selectedGenre.includes(genreId)) {
        selectedGenre = selectedGenre.filter(id => id !== genreId);
    } else {
        selectedGenre.push(genreId);
    }
}

export function updatePaginationButtons() {
    if (currentPage <= 1) {
        prev.classList.add('disabled');
        next.classList.remove('disabled');
    } else if (currentPage >= totalPages) {
        prev.classList.remove('disabled');
        next.classList.add('disabled');
    } else {
        prev.classList.remove('disabled');
        next.classList.remove('disabled');
    }
}

export function getColor(vote) {
    if (vote >= 8) return 'green';
    else if (vote >= 6) return 'orange';
    else return 'red';
}

// Otras funciones relacionadas con las películas
