import { Component, OnInit } from '@angular/core';
import { MoviesListService } from './movies-list.service';
import { Observable } from 'rxjs/Observable';
import { ApiMovieObject, MovieObject } from '../../movies.interfaces';
import { each, map, find, join } from 'lodash';
import 'rxjs/add/operator/do';
import { LoginService } from '../../shared/login.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { ADD_SESSION } from '../../shared/user/user-session.reducer';
import { ADD_PROFILE } from '../../shared/user/user-profile.reducer';
import { UserService } from '../../shared/user/user.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/take';
/*
MoviesListComponent
--- handles list of movies
--- gets movie list from API using MovieListService
--- handles movies filtering based on year, genre and sorts movie by popularity or rating
--- handkles user log in
--- initializes store and populates it with user sessionId, profile, rated movies and favorite movies
*/
@Component({
    selector: 'movies-list',
    templateUrl: 'movies-list.component.html'
})

export class MoviesListComponent implements OnInit {
    movies$: Observable<MovieObject[]>;
    genres$: Observable<any>;
    userSessionId$: Observable<string>;
    genres: any;
    currentPage = <number>1;
    totalPages = <number>1;
    totalResults = <number>0;
    years: number[];
    loading = <boolean>false;
    sessionId: string;
    userId: string;
    private userSession$: Observable<string | null>;

    constructor(
        private _moviesService: MoviesListService,
        private _loginService: LoginService,
        private _route: ActivatedRoute,
        private _store: Store<any>,
        private _userService: UserService
    ) { }

    ngOnInit() {
        // Checking query params based on which user login is done
        this._route.queryParams
            // returns value only when params.approved and params.request_token are defined
            .filter(params => params.approved && params.request_token)
            // authenticates user with API
            .switchMap(params => this._loginService.authenticateUser(params.request_token))
            // stores session in ngrx Store
            .do(data => this._store.dispatch({ type: ADD_SESSION, payload: data.session_id }))
            .map(data => data.session_id)
            .do(sessionId => this.sessionId = sessionId)
            // gets user profile from API
            .switchMap(sessionId => this._userService.getUserProfile(sessionId))
            // stores user profile in ngrx Store
            .do(data => this._store.dispatch({ type: ADD_PROFILE, payload: data }))
            .do(data => this.userId = data.id)
            // gets rated movies from API
            .switchMap(data => this._userService.getRatedMovies(this.sessionId, data.id))
            // stores rated movies in ngrx Store
            .do(data => this._store.dispatch({ type: 'INIT_RATED_MOVIES', payload: data.results }))
            // gets user favorite movies from API
            .switchMap(data => this._userService.getFavoriteMovies(this.sessionId, this.userId))
            // stores user favorite movies in ngrx Store
            .do(data => this._store.dispatch({ type: 'INIT_FAVORITE_MOVIES', payload: data.results }))
            .subscribe(data => console.log('data', data));

        // generate years array used in select year dropdown
        this.years = this._moviesService.generateYears(1900);

        // movies stream, used for populating movies list
        this.movies$ = this._moviesService.movies$
            .do(data => {
                this.totalPages = data.total_pages;
                this.totalResults = data.total_results;
                this.currentPage = data.page;
            })
            .map(data => data.results)
            .map((results: ApiMovieObject[]) => results.map(r => this._prepareMovie(r)))
            .do(data => this.loading = false);

        // gets movies from api
        this.genres$ = this._moviesService.genresList$
            .do(data => this.genres = data);
    }

    // changes page
    nextPage() {
        this.loading = true;
        window.scrollTo(0, 0);
        this.currentPage++;
        this._moviesService.changePage(this.currentPage);
    }

    // changes page
    previousPage() {
        this.loading = true;
        window.scrollTo(0, 0);
        this.currentPage--;
        this._moviesService.changePage(this.currentPage);
    }

    // changes genre
    changeGenre(genre: string) {
        this.loading = true;
        this._moviesService.changeGenre(genre !== 'none' ? genre : null);
    }

    // changes year
    changeYear(year: number) {
        this.loading = true;
        this._moviesService.changeYear(year !== 0 ? year : null);
    }

    // changes sort by
    changeSortBy(sortBy: string) {
        this.loading = true;
        this._moviesService.changeSortBy(sortBy);
    }

    // prepares movie object for movie MovieCardComponent
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
        each(apiMovie.genre_ids, (genreId: number) => {
            const genre = find(this.genres, { id: genreId });
            if (genre) {
                genreNames.push(genre.name);
            }
        });
        movie.genresLabel = join(genreNames, ', ');
        return movie;
    }
}
