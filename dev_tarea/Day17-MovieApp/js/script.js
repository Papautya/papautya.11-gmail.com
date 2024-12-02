// TMDB API Configuration
const API_KEY = "api_key=1cf50e6248dc270629e802686245c2c8";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?language=es-ES&sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = `${BASE_URL}/search/movie?${API_KEY}`;

const genres = [
  { id: 28, name: "Acción" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" },
  { id: 99, name: "Documental" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Familia" },
  { id: 14, name: "Fantasía" },
  { id: 36, name: "Historia" },
  { id: 27, name: "Terror" },
  { id: 10402, name: "Música" },
  { id: 9648, name: "Misterio" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ciencia Ficción" },
  { id: 10770, name: "Película de TV" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "Guerra" },
  { id: 37, name: "Viejo Oeste" },
];

const main = document.getElementById("main");
const movies = document.getElementById("movies");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPages = 100;

let activeSlide = 0;
let totalVideos = 0;
let filterAPI = "";

let selectedGenre = [];
setGenre();
getMovies(API_URL);

function filter() {
  var forms = document.getElementsByClassName("needs-validation");
  var validation = Array.prototype.filter.call(forms, function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });

  const name = document.getElementById("txtName").value;
  if (name) {
    const year = document.getElementById("txtYear").value;
    const isChecked = document.getElementById("btnAdult").checked;

    filterAPI = "&query=" + name;

    if (year.length > 0) {
      filterAPI += "&year=" + year;
    }

    filterAPI += "&include_adult=" + isChecked;

    //  e.preventDefault();
    selectedGenre = [];
    setGenre();

    if (filterAPI) {
      getMovies(searchURL + filterAPI);
    } else {
      getMovies(API_URL);
    }
  } else {
    alert("El nombre de la pelicula es obligatorio.");
  }
}

function setGenre() {
  tagsEl.innerHTML = "";

  genres.forEach((genre) => {
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("btn", "btn-light", "tag");
    buttonElement.id = genre.id;
    buttonElement.innerText = genre.name;
    buttonElement.style.margin = ".2em .2em";

    buttonElement.addEventListener("click", () => {
      toggleGenreSelection(genre.id);
      getMovies(`${API_URL}&with_genres=${encodeURI(selectedGenre.join(","))}`);
      highlightSelection();

      buttonElement.classList.add("selected");
      buttonElement.classList.remove("btn-light");
      buttonElement.classList.add("btn-primary");
    });

    tagsEl.append(buttonElement);
  });
}

function toggleGenreSelection(genreId) {
  if (selectedGenre.includes(genreId)) {
    selectedGenre = selectedGenre.filter((id) => id !== genreId);
  } else {
    selectedGenre.push(genreId);
  }
}

function highlightSelection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => tag.classList.remove("highlight"));
  clearBtn();

  if (selectedGenre.length !== 0) {
    selectedGenre.forEach((id) => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add("highlight");
    });
  }
}

function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (!clearBtn) {
    clearBtn = document.createElement("button");
    clearBtn.classList.add("btn", "btn-danger");
    clearBtn.id = "clear";
    clearBtn.innerText = "Limpiar Filtros";
    clearBtn.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    });
    tagsEl.append(clearBtn);
  }
}

function getMovies(url) {
  lastUrl = url;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;
        updatePaginationButtons();
      } else {
        main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
      }
    })
    .catch((err) => console.error("Error fetching movies:", err));
}

function updatePaginationButtons() {
  if (currentPage <= 1) {
    prev.classList.add("disabled");
    next.classList.remove("disabled");
  } else if (currentPage >= totalPages) {
    prev.classList.remove("disabled");
    next.classList.add("disabled");
  } else {
    prev.classList.remove("disabled");
    next.classList.remove("disabled");
  }
}

async function showMovies(data) {
    movies.innerHTML = "";
  
    // Utilizamos un bucle for...of para poder usar await dentro del bucle
    for (const movie of data) {
      const { title, poster_path, vote_average, overview, id } = movie;
  
      const imageUrl = poster_path
        ? IMG_URL + poster_path
        : "../images/no_image.jpg"; // Ruta de la imagen predeterminada
  
      const color_vote_average = getColor(vote_average);
      const fix_vote_average = vote_average.toFixed(1);
  
      // Inicializa names como una variable de alcance de bloque
      let names = "";
  
      // Espera la respuesta de la API para obtener los créditos
      try {
        const response = await fetch(BASE_URL + "/movie/" + id + "/credits?" + API_KEY + "&language=es-ES");
        const creditsData = await response.json();
  
        if (creditsData) {
          names += creditsData.cast.slice(0, 5).map(person => person.name).join(", ");
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
  
      // Agrega el HTML al contenedor de películas
      movies.innerHTML += `
        <div class="col-lg-4">
          <div class="card" id="show${id}"> <!-- Cambiado id a show${id} para ser único -->
            <div class="card-image">
              <div class="wrap">
                <img style="width: 100%; height: 525px;" src="${imageUrl}" alt="image ${id}">
              </div>
            </div>
            <div class="card-content bg-secondary text-light">
              <span class="card-title" style="font-size: 1rem;">${title}</span>
              <span class="badge" style="background-color: ${color_vote_average}; color: white; font-size: 0.8rem; margin-left: 0.5rem;">${fix_vote_average}</span>
            </div>
            <div class="card-reveal show${id}" style="display: none;">
              <span class="card-title">${title}</span>
              <span class="card-title" style="background-color: ${color_vote_average}; color: white; font-size: 0.8rem; margin-left: 0.5rem;">${fix_vote_average}</span>
              <hr>
              <span class="card-title">Sinopsis</span>
              <p>${overview}</p>
              <hr>
              <span class="card-title">Reparto</span>
              <p>${names}</p>
            </div>
          </div>
        </div>
      `;
    }
  
    // Manejo de jQuery para la interacción con las tarjetas
    jQuery(document).ready(function ($) {
      $(".card").each(function () {
        let timer;
  
        $(this).mouseenter(function () {
          const target = $(this).find(".card-reveal");
          timer = setTimeout(function () {
            target.slideDown("slow");
          }, 500);
        });
  
        $(this).mouseleave(function () {
          clearTimeout(timer);
          $(this).find(".card-reveal").slideUp("slow");
        });
      });
    });
  }
  

function openNav(movie) {
  const id = movie.id;
  fetch(`${BASE_URL}/movie/${id}/videos?${API_KEY}`)
    .then((res) => res.json())
    .then((videoData) => {
      if (videoData) {
        document.getElementById("myNav").style.width = "100%";
        displayVideos(videoData.results, movie.original_title);
      }
    })
    .catch((err) => console.error("Error fetching video data:", err));
}

function displayVideos(videoResults, movieTitle) {
  const overlayContent = document.getElementById("overlay-content");
  if (videoResults.length > 0) {
    const embed = videoResults
      .filter((video) => video.site === "YouTube")
      .map(
        (video, idx) => `
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.key}" title="${video.name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `
      )
      .join("");

    const dots = videoResults
      .map((_, idx) => `<span class="dot">${idx + 1}</span>`)
      .join("");
    overlayContent.innerHTML = `
            <h1 class="no-results">${movieTitle}</h1>
            <br/>
            ${embed}
            <br/>
            <div class="dots">${dots}</div>
        `;

    activeSlide = 0;
    showVideos();
  } else {
    overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
  }
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function showVideos() {
  const embedClasses = document.querySelectorAll(".embed");
  const dots = document.querySelectorAll(".dot");
  totalVideos = embedClasses.length;

  embedClasses.forEach((embed, index) => {
    embed.classList.add("hide");
    dots[index].classList.remove("active");
  });

  embedClasses[activeSlide].classList.remove("hide");
  dots[activeSlide].classList.add("active");

  activeSlide = (activeSlide + 1) % totalVideos;

  setTimeout(showVideos, 4000);
}

function getColor(vote) {
  if (vote >= 8) return "green";
  else if (vote >= 6) return "orange";
  else return "red";
}

next.addEventListener("click", () => {
  if (next.classList.contains("disabled")) return;
  getMovies(`${lastUrl}&page=${nextPage}`);
});

prev.addEventListener("click", () => {
  if (prev.classList.contains("disabled")) return;
  getMovies(`${lastUrl}&page=${prevPage}`);
});

$("#exampleModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var recipient = button.data("whatever"); // Extract info from data-* attributes
});
