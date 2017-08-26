import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

@Injectable()
export class MoviesSearchService {

    constructor(
        private _apiService: ApiService
    ) { }

    searchMovies(query: string) {
        return this._apiService.observableGetCall('search/movie', {query: query});
    }
}
