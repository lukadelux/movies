import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserProfile } from '../../shared/user/user-profile.reducer';
import { UserSession } from '../../shared/user/user-session.reducer';
import { UserService } from '../../shared/user/user.service';
import { find } from 'lodash';
import { UPDATE_RATING, ADD_RATED_MOVIES } from '../../shared/user/user-rated-movies.reducer';
import { ADD_FAVORITE_MOVIE, REMOVE_FAVORITE_MOVIE } from '../../shared/user/user-favorite-movies.reducer';
/* MovieInfoComponent
@Input('movie') - movie to display
--- displays information of the selected movie
--- handles movie ratings and adding / removing movie from favorites if user is logged in
*/

@Component({
    selector: 'movie-info',
    templateUrl: 'movie-info.component.html'
})

export class MovieInfoComponent implements OnInit {
    user: UserProfile;
    sessionId: string;
    rates: number[];
    @Input('movie') movie: any;
    rate = <number | null>null;
    movieAlreadyRated = <boolean>false;
    ratedMovie;
    isFavorite = <boolean>false;

    constructor(
        private _store: Store<any>,
        private _userService: UserService
    ) { }

    ngOnInit() {
        this.rates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this._store.select('userSession')
            .filter(data => !!data)
            .do((data: UserSession) => this.sessionId = data.session_id)
            .switchMap(data => this._store.select('userProfile'))
            .subscribe((data: UserProfile) => {
                if (data) {
                    this.user = data;
                }
            });

        this._store.select('userRatedMovies')
            .filter(data => !!data)
            .subscribe(data => {
                let ratedMovie = find(data, { id: this.movie.id });
                if (ratedMovie) {
                    this.rate = ratedMovie.rating;
                    this.movieAlreadyRated = true;
                }
            });


        this._store.select('userFavoriteMovies')
            .filter(data => !!data)
            .subscribe(data => {
                console.log('FAV DATA', data);
                let favMovie = find(data, { id: this.movie.id });
                if (favMovie) {
                    this.isFavorite = true;
                }
            });
    }

    rateMovie() {
        if (this.rate) {
            this._userService.rateMovie(this.movie.id, this.rate, this.sessionId).subscribe(data => {
                if (this.movieAlreadyRated) {
                    console.log('THIS IS CALLED');
                    this._store.dispatch({ type: UPDATE_RATING, payload: { id: this.movie.id, rate: this.rate } });
                } else {
                    this.movie.metadata.rating = this.rate;
                    this._store.dispatch({ type: ADD_RATED_MOVIES, payload: [this.movie.metadata] });
                }
            });
        }
    }

    markAsFavorite(isFav: boolean) {
        this._userService.markAsFavorite(this.movie.id, this.user.id, this.sessionId, isFav)
            .subscribe(data => {
                this.isFavorite = isFav;
                if (this.isFavorite) {
                    this._store.dispatch({ type: ADD_FAVORITE_MOVIE, payload: this.movie.metadata });
                } else {
                    this._store.dispatch({ type: REMOVE_FAVORITE_MOVIE, payload: this.movie.id });
                }
            });
    }
}
