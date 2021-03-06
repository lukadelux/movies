import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MovieDetailsService } from './movie-details.service';
import { ApiSingleMovieObject, MovieInfoObject, MovieReview, MovieCast } from '../movies.interfaces';
import { each, find, join, flatMap } from 'lodash';

/* MovieDetailsComponent
-- handles single movie page
-- incorporates MovieInfo and MovieReview componetns
-- gets movie from API and prepares it for child components
*/
@Component({
    selector: 'movie-details.component.ts',
    templateUrl: 'movie-details.component.html',
    styleUrls: ['movie-details.component.css']
})

export class MovieDetailsComponent implements OnInit, OnDestroy {
    movie: MovieInfoObject;
    movieSubscription;
    loading = <boolean>false;
    movieReviews: MovieReview[];
    movieCast: MovieCast[];
    activeTab = <string>'panel1';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _movieDetalisService: MovieDetailsService
    ) { }

    ngOnInit() {
        this.movieSubscription = this.route.paramMap
            // gets movie id from url and gets movie by id from API
            .switchMap((params: ParamMap) =>
                this._movieDetalisService.getMovie(params.get('id')))
            .filter(data => !!data)
            // prepares movie for MovieInfoComponent
            .map((apiMovie: ApiSingleMovieObject) => this._prepareMovieInfo(apiMovie))
            .do(data => {
                console.log('MOVIE DATA', data);
                this.movie = data;
                this.loading = false;
                console.log('this.loading', this.loading);
            })
            // gets movie reviews from API
            .switchMap(data => this._movieDetalisService.getMovieReviews(data.id))
            .map(data => data.results)
            .do(results => this.movieReviews = results)
            // gets movie credits from API
            .switchMap(_ => this._movieDetalisService.getMovieCredits(this.movie.id))
            .map(data => data.cast)
            .subscribe(results => {
                this.movieCast = results;
            });
    }

    // prepares movie for MovieInfoComponent
    private _prepareMovieInfo(apiMovie: ApiSingleMovieObject): MovieInfoObject {
        console.log('apiMovie', apiMovie);
        const movie: MovieInfoObject = {
            id: apiMovie.id,
            title: apiMovie.title,
            description: apiMovie.overview,
            imageUrl: `http://image.tmdb.org/t/p/w300_and_h450_bestv2${apiMovie.poster_path}`,
            rating: apiMovie.vote_average,
            genresLabel: join(flatMap(apiMovie.genres, 'name'), ', '),
            year: apiMovie.release_date.substr(0, 4),
            imdbUrl: `http://www.imdb.com/title/${apiMovie.imdb_id}`,
            movieUrl: apiMovie.homepage ? apiMovie.homepage : '',
            metadata: apiMovie
        };
        console.log('movie');
        console.log(movie);
        return movie;
    }

    setActiveTab(activeTab) {
        this.activeTab = activeTab;
    }

    ngOnDestroy() {
        this.movieSubscription.unsubscribe();
    }
}
