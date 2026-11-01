
import { useState } from "react";
import "./App.css";

export default function App() {
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("5");
  const [movies, setMovies] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();// prevent from reload

    if (!title.trim()) {
      alert("Please enter a movie title.");
      return;
    }

    const newMovie = {
      id: crypto.randomUUID(),
      title: title.trim(),
      review: review.trim(),
      rating: Number(rating),
    };

    setMovies((previousMovies) => [...previousMovies, newMovie]);

    setTitle("");
    setReview("");
    setRating("5");
  }

  function handleRemove(movieId) {
    setMovies((previousMovies) =>
      previousMovies.filter((movie) => movie.id !== movieId)
    );
  }

  return (
    <main className="app">
      <header className="page-header">
        <h1>🎬 Movie Watchlist</h1>
        <p className="subtitle">
          Keep track of the movies you've watched.
        </p>
      </header>

      <form className="movie-form" onSubmit={handleSubmit}>
        <h2>Add a movie</h2>

        <label htmlFor="movie-title">Movie title</label>
        <input
          id="movie-title"
          type="text"
          placeholder="e.g. The Fault in Our Stars"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor="movie-review">Your review</label>
        <textarea
          id="movie-review"
          placeholder="What did you think of the movie?"
          value={review}
          onChange={(event) => setReview(event.target.value)}
        />

        <label htmlFor="movie-rating">Your rating</label>
        <select
          id="movie-rating"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        >
          <option value="1">1 star</option>
          <option value="2">2 stars</option>
          <option value="3">3 stars</option>
          <option value="4">4 stars</option>
          <option value="5">5 stars</option>
        </select>

        <button className="add-button" type="submit">
          Add Movie
        </button>
      </form>

      <section className="movie-list">
        <h2>Your movies ({movies.length})</h2>

        {movies.length === 0 ? (
          <p className="empty-state">
            Your watchlist is empty. Add your first movie!
          </p>
        ) : (
          movies.map((movie) => (
            <article className="movie-card" key={movie.id}>
              <h3>{movie.title}</h3>

              <p className="stars" aria-label={`${movie.rating} out of 5 stars`}>
                {"⭐".repeat(movie.rating)}
                {"☆".repeat(5 - movie.rating)}
              </p>

              <p>
                <strong>Your review:</strong>{" "}
                {movie.review || "No review added."}
              </p>

              <p>
                <strong>Rating:</strong> {movie.rating}/5
              </p>

              <button
                className="remove-button"
                type="button"
                onClick={() => handleRemove(movie.id)}
              >
                Remove
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
