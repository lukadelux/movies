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
        this._route.queryParams
            .filter(params => params.approved && params.request_token)
            .switchMap(params => this._loginService.authenticateUser(params.request_token))
            .do(data => this._store.dispatch({ type: ADD_SESSION, payload: data.session_id }))
            .map(data => data.session_id)
            .do(sessionId => this.sessionId = sessionId)
            .switchMap(sessionId => this._userService.getUserProfile(sessionId))
            .do(data => this._store.dispatch({ type: ADD_PROFILE, payload: data }))
            .do(data => this.userId = data.id)
            .switchMap(data => this._userService.getRatedMovies(this.sessionId, data.id))
            .do(data => this._store.dispatch({ type: 'INIT_RATED_MOVIES', payload: data.results }))
            .switchMap(data => this._userService.getFavoriteMovies(this.sessionId, this.userId))
            .do(data => this._store.dispatch({ type: 'INIT_FAVORITE_MOVIES', payload: data.results }))
            .subscribe(data => console.log('data', data));

        this.years = this._moviesService.generateYears(1900);

        this.movies$ = this._moviesService.movies$
            .do(data => {
                this.totalPages = data.total_pages;
                this.totalResults = data.total_results;
                this.currentPage = data.page;
            })
            .map(data => data.results)
            .map((results: ApiMovieObject[]) => results.map(r => this._prepareMovie(r)))
            .do(data => this.loading = false);

        this.genres$ = this._moviesService.genresList$
            .do(data => this.genres = data);
    }

    nextPage() {
        this.loading = true;
        window.scrollTo(0, 0);
        this.currentPage++;
        this._moviesService.changePage(this.currentPage);
    }

    previousPage() {
        this.loading = true;
        window.scrollTo(0, 0);
        this.currentPage--;
        this._moviesService.changePage(this.currentPage);
    }

    changeGenre(genre: string) {
        this.loading = true;
        this._moviesService.changeGenre(genre !== 'none' ? genre : null);
    }

    changeYear(year: number) {
        this.loading = true;
        this._moviesService.changeYear(year !== 0 ? year : null);
    }

    changeSortBy(sortBy: string) {
        this.loading = true;
        this._moviesService.changeSortBy(sortBy);
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
