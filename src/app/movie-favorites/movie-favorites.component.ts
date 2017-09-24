import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiMovieObject, MovieObject } from '../movies.interfaces';
/*
MovieFavoritesComponent
--- displays list of logged in user favorited films
*/
@Component({
    selector: 'movie-favorites',
    templateUrl: 'movie-favorites.component.html'
})

export class MovieFavoritesComponent implements OnInit {
    favorites = [];

    constructor(
        private _store: Store<any>
    ) { }

    ngOnInit() {
        this._store.select('userFavoriteMovies')
            .filter(data => !!data)
            .map((data: ApiMovieObject[]) => data.map(d => this._prepareMovie(d)))
            .subscribe(data => {
                this.favorites = data;
                console.log('this.favorites');
                console.log(this.favorites);
            });
    }

    private _prepareMovie(apiMovie: ApiMovieObject): MovieObject {
        const movie: MovieObject = {
            id: apiMovie.id,
            title: apiMovie.title,
            description: apiMovie.overview,
            imageUrl: `http://image.tmdb.org/t/p/w185${apiMovie.poster_path}`,
            rating: apiMovie.vote_average,
            genresLabel: ''
        };
        const genreNames = [];
        return movie;
    }
}
