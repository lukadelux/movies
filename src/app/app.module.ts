import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule, combineReducers } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // DEV only
import { userSessionReducer } from './shared/user/user-session.reducer';
import { userProfileReducer } from './shared/user/user-profile.reducer';
import { userRatedMoviesReducer } from './shared/user/user-rated-movies.reducer';
import { userFavoriteMoviesReducer } from './shared/user/user-favorite-movies.reducer';
import { localStorageSync } from 'ngrx-store-localstorage'; // Simple syncing between ngrx store and local storage
import { AppComponent } from './app.component';
import { compose } from '@ngrx/core/compose';

// Components
import { MoviesComponent } from './movies/movies.component';
import { MoviesListComponent } from './movies/movies-list/movies-list.component';
import { MovieCardComponent } from './shared/movie-card/movie-card.component';
import { MoviesSearchComponent } from './movies/movies-search/movies-search.component';
import { MovieSearchResultComponent } from './movies/movies-search/movie-search-result/movie-search-result.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieInfoComponent } from './movie-details/movie-info/movie-info.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './shared/login/login.component';
import { MovieFavoritesComponent } from './movie-favorites/movie-favorites.component';
import { MovieReviewComponent } from './movie-details/movie-review/movie-review.component';

// Services
import { ApiService } from './api.service';
import { MoviesListService } from './movies/movies-list/movies-list.service';
import { MoviesSearchService } from './movies/movies-search/movies-search.service';
import { MovieDetailsService } from './movie-details/movie-details.service';
import { LoginService } from './shared/login.service';
import { UserService } from './shared/user/user.service';

// Routes
const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'movies',
        pathMatch: 'full'
    },
    {
        path: 'movies',
        component: MoviesComponent
    },
    {
        path: 'movie/:id',
        component: MovieDetailsComponent
    },
    {
        path: 'favorites',
        component: MovieFavoritesComponent
    }
];

export function appReducer(state: any, action: any) {
    return compose(
        localStorageSync(['userSession', 'userProfile', 'userRatedMovies', 'userFavoriteMovies'], true),
        combineReducers
    )({
        userSession: userSessionReducer,
        userProfile: userProfileReducer,
        userRatedMovies: userRatedMoviesReducer,
        userFavoriteMovies: userFavoriteMoviesReducer
    })(state, action);
}

@NgModule({
    declarations: [
        AppComponent,
        MoviesComponent,
        MoviesListComponent,
        MovieCardComponent,
        MovieDetailsComponent,
        MoviesSearchComponent,
        MovieSearchResultComponent,
        MovieInfoComponent,
        HeaderComponent,
        LoginComponent,
        MovieFavoritesComponent,
        MovieReviewComponent

    ],
    imports: [
        RouterModule.forRoot(
            appRoutes
            // { enableTracing: true } // <-- debugging purposes only
        ),
        BrowserModule,
        FormsModule,
        HttpModule,
        StoreModule.provideStore(appReducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(), // DEV only
    ],
    providers: [
        ApiService,
        MoviesListService,
        MoviesSearchService,
        MovieDetailsService,
        LoginService,
        UserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
