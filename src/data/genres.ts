export const genres = [
  { id: "comedy", name: "Комедия", poster: "/img/genres/img_1.png" },
  { id: "drama", name: "Драма", poster: "/img/genres/img_2.png" },
  { id: "adventure", name: "Приключения", poster: "/img/genres/img_3.png" },
  { id: "mystery", name: "Детектив", poster: "/img/genres/img_4.png" },
  { id: "scifi", name: "Фантастика", poster: "/img/genres/img_5.png" },
  { id: "family", name: "Семейное", poster: "/img/genres/img_6.png" },
  { id: "thriller", name: "Триллер", poster: "/img/genres/img_7.png" },
  { id: "history", name: "Историческое", poster: "/img/genres/img_8.png" },
  { id: "animation", name: "Анимация", poster: "/img/genres/img_9.png" },
  { id: "action", name: "Боевик", poster: "/img/genres/img_10.png" },
  { id: "western", name: "Вестерн", poster: "/img/genres/img_11.png" },
  { id: "war", name: "Военный", poster: "/img/genres/img_12.png" },
  { id: "documentary", name: "Документальный", poster: "/img/genres/img_13.png" },
  { id: "crime", name: "Криминал", poster: "/img/genres/img_14.png" },
  { id: "music", name: "Музыкальный", poster: "/img/genres/img_15.png" },
  { id: "romance", name: "Романтика", poster: "/img/genres/img_16.png" },
  { id: "stand-up", name: "Стендап", poster: "/img/genres/img_17.png" },
  { id: "tv-movie", name: "ТВ-фильм", poster: "/img/genres/img_18.png" },
  { id: "horror", name: "Ужасы", poster: "/img/genres/img_19.png" },
  { id: "fantasy", name: "Фэнтези", poster: "/img/genres/img_20.png" },
];

export type Genre = (typeof genres)[number];
