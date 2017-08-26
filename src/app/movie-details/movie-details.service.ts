import { Injectable } from '@angular/core';
import { findIndex, each, assign, reverse } from 'lodash';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { ApiSingleMovieObject } from '../movies.interfaces';

@Injectable()
export class MovieDetailsService {
    constructor(
        private _apiService: ApiService
    ) { }

    getMovie(movieId: string): Observable<ApiSingleMovieObject> {
        return this._apiService.observableGetCall(`movie/${movieId}`, null);
    }

    getMovieReviews(movieId: number): Observable<any> {
        return this._apiService.observableGetCall(`movie/${movieId}/reviews`, null);
    }

    getMovieCredits(movieId: number): Observable<any> {
        return this._apiService.observableGetCall(`movie/${movieId}/credits`, null);
    }
}
