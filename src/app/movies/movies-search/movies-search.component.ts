import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { MoviesSearchService } from './movies-search.service';
import { ApiMovieObject } from '../../movies.interfaces';
import { MovieSearchResult } from './movie-search-result/movie-search-result.component';
import 'rxjs/add/operator/debounceTime';

/*
MoviesSearchComponent
--- handles search results
--- prepares results for movie-search-result component
*/

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
        /* Searches movies based on input query */
        this.searchResults$ = this.query$
            // 500ms on search query
            .debounceTime(500)
            // getting movie results from API
            .switchMap((query) => {
                if (query) {
                    return this._moviesSearchService.searchMovies(query);
                }
            })
            // mapping and preparing results
            .map(response => response.results)
            .map(results => results.map(m => this._prepareMovieResult(m)));
    }

    searchMovies() {
        // trigger search when query changes
        this.query$.next(this.query);
    }

    // Prepare movie result for MovieSearchResultComponent
    private _prepareMovieResult(apiMovie: ApiMovieObject): MovieSearchResult {
        return {
            id: apiMovie.id,
            title: apiMovie.title,
            description: apiMovie.overview,
            imageUrl: `http://image.tmdb.org/t/p/w45_and_h67_bestv2${apiMovie.poster_path}`
        };
    }
}
