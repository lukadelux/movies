import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { RESET_SESSION } from '../user/user-session.reducer';
import { RESET_PROFILE } from '../user/user-profile.reducer';
import { RESET_RATED_MOVIES } from '../user/user-rated-movies.reducer';
import {Router} from '@angular/router';
@Injectable()
export class UserService {

    constructor(
        private _apiService: ApiService,
        private _store: Store<any>,
        private _router: Router
    ) { }

    getUserProfile(sessionId: string): Observable<any> {
        return this._apiService.observableGetCall('account', { session_id: sessionId });
    }

    rateMovie(movieId: number, rating: number, sessionId: string) {
        const item = {
            value: rating
        };
        return this._apiService.observablePostCall(`movie/${movieId}/rating`, { session_id: sessionId }, item);
    }

    getRatedMovies(sessionId: string, userId: string) {
        return this._apiService.observableGetCall(`account/${userId}/rated/movies`, { session_id: sessionId });
    }

    getFavoriteMovies(sessionId: string, userId: string) {
        return this._apiService.observableGetCall(`account/${userId}/favorite/movies`, { session_id: sessionId });
    }

    markAsFavorite(movieId: number, userId: number, sessionId: string, favorite: boolean) {
        const item = {
            media_type: 'movie',
            media_id: movieId,
            favorite: favorite
        };
        return this._apiService.observablePostCall(`account/${userId}/favorite`, { session_id: sessionId }, item);
    }

    logout() {
        this._store.dispatch({type: RESET_SESSION, payload: null});
        this._store.dispatch({type: RESET_PROFILE, payload: null});
        this._store.dispatch({type: RESET_RATED_MOVIES, payload: null});

        this._router.navigate(['movies']);
    }
}
