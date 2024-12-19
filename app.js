const API_URL = 'http://localhost:3000/movies';

document.getElementById('getMovies').addEventListener('click', fetchMovies);

function fetchMovies() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((movies) => displayMovies(movies))
    .catch((error) => console.error('Помилка при отриманні фільмів:', error));
}

function displayMovies(movies) {
  const tableBody = document.querySelector('#moviesTable tbody');
  tableBody.innerHTML = '';

  movies.forEach((movie) => {
    const row = `
      <tr>
        <td>${movie.id}</td>
        <td>${movie.title}</td>
        <td>${movie.genre}</td>
        <td>${movie.director}</td>
        <td>${movie.year}</td>
        <td>
          <button onclick="updateMovie(${movie.id})">Оновити</button>
          <button onclick="editMovie(${movie.id})">Редагувати</button>
          <button onclick="deleteMovie(${movie.id})">Видалити</button>
        </td>
      </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', row);
  });
}

document.getElementById('addMovieForm').addEventListener('submit', addMovie);

function addMovie(event) {
  event.preventDefault();

  const newMovie = {
    title: document.getElementById('title').value,
    genre: document.getElementById('genre').value,
    director: document.getElementById('director').value,
    year: parseInt(document.getElementById('year').value),
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMovie),
  })
    .then((response) => response.json())
    .then(() => {
      fetchMovies();
      document.getElementById('addMovieForm').reset();
    })
    .catch((error) => console.error('Помилка при додаванні фільму:', error));
}

function updateMovie(id) {
  const updatedMovie = {
    title: prompt('Нова назва:', ''),
    genre: prompt('Новий жанр:', ''),
    director: prompt('Новий режисер:', ''),
    year: parseInt(prompt('Новий рік:', '')),
  };

  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedMovie),
  })
    .then(() => fetchMovies())
    .catch((error) => console.error('Помилка при оновленні фільму:', error));
}

function editMovie(id) {
  const field = prompt('Яке поле хочете змінити? (title, genre, director, year)');
  const value = prompt(`Нове значення для ${field}:`, '');

  if (field && value) {
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: field === 'year' ? parseInt(value) : value }),
    })
      .then(() => fetchMovies())
      .catch((error) => console.error('Помилка при редагуванні фільму:', error));
  }
}

function deleteMovie(id) {
  if (confirm('Ви впевнені, що хочете видалити цей фільм?')) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => fetchMovies())
      .catch((error) => console.error('Помилка при видаленні фільму:', error));
  }
}