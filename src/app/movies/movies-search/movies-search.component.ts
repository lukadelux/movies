import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { MoviesSearchService } from './movies-search.service';
import { ApiMovieObject } from '../../movies.interfaces';
import { MovieSearchResult } from './movie-search-result/movie-search-result.component';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'movies-search',
    templateUrl: 'movies-search.component.html',
    styleUrls: ['movies-search.component.css']
})

export class MoviesSearchComponent implements OnInit {
    searchResults$: Observable<any>;
    query$ = new Subject<string | null>();
    query = <string>'';

    constructor(
        private _moviesSearchService: MoviesSearchService
    ) { }

    ngOnInit() {
        this.searchResults$ = this.query$
            .debounceTime(500)
            .switchMap((query) => {
                if (query) {
                    return this._moviesSearchService.searchMovies(query);
                }
            })
            .map(response => response.results)
            .map(results => results.map(m => this._prepareMovieResult(m)));
    }

    searchMovies() {
        this.query$.next(this.query);
    }

    private _prepareMovieResult(apiMovie: ApiMovieObject): MovieSearchResult {
        return {
            id: apiMovie.id,
            title: apiMovie.title,
            description: apiMovie.overview,
            imageUrl: `http://image.tmdb.org/t/p/w45_and_h67_bestv2${apiMovie.poster_path}`
        };
    }
}
