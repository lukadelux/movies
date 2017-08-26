export interface ApiMovieObject {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    video: boolean;
    release_date: string;
    title: string;
    vote_average: number;
    vote_count: string;
};

export interface ApiSingleMovieObject {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: null;
    budget: number;
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: any;
    production_countries: any;
    revenue: number;
    runtime: number;
    spoken_languages: any;
    status: string;
    video: boolean;
    tagline: string;
    release_date: string;
    title: string;
    vote_average: number;
    vote_count: string;
};

export interface MovieObject {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    rating: number;
    genresLabel: string;
}

export interface MovieInfoObject {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    rating: number;
    genresLabel: string;
    year: string;
    imdbUrl: string;
    movieUrl: string;
    metadata: any;
}
export interface Genre {
    id: number;
    name: string;
}

export interface MovieReview {
    author: string;
    content: string;
    id: string;
    url: string;
}

export interface MovieCast {
    cast_id: number;
    character: string;
    credit_id: string;
    gender: number;
    id: number;
    name: string;
    order: number;
    profile_path: string;
}
