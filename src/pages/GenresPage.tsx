import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres } from "../api/index";
import { genres as localGenres, type Genre } from "../data/genres";

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGenres();
        // setGenres(data);
        const transformedGenres: Genre[] = data.map((genreId) => {
          const localData = localGenres.find((g) => g.id.toLowerCase() === genreId.toLowerCase());

          return {
            id: genreId,
            name: localData?.name || genreId,
            poster: localData?.poster || "/img/genre-plug.jpg",
          };
        });

        setGenres(transformedGenres);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки жанров");
        console.error("Ошибка загрузки жанров:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <section className="genres container">
        <h1 className="genres__title">Жанры фильмов</h1>
        <p>Загрузка...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="genres container">
        <h1 className="genres__title">Жанры фильмов</h1>
        <p style={{ color: "red" }}>Ошибка: {error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </section>
    );
  }

  return (
    <>
      <h1 className="visually-hidden">Список фильмов по жанру</h1>
      <section className="genres container">
        <h1 className="genres__title">Жанры фильмов</h1>
        <ul className="genres__list">
          {genres.map((genre) => (
            <li className="genres__item" key={genre.id}>
              <Link to={`/genres/${genre.id}`} className="genres__card">
                <img src={genre.poster} alt={`Постер жанра ${genre.name}`} className="genres__poster" loading="lazy" />
                <div className="genres__label">{genre.name}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
