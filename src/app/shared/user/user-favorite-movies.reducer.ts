// counter.ts
import { ActionReducer, Action } from '@ngrx/store';
import { ApiMovieObject } from '../../movies.interfaces';
export const INIT_FAVORITE_MOVIES = 'INIT_FAVORITE_MOVIES';
export const ADD_FAVORITE_MOVIE = 'ADD_FAVORITE_MOVIE';
export const REMOVE_FAVORITE_MOVIE = 'REMOVE_FAVORITE_MOVIE';
export const RESET_FAVORITE_MOVIES = 'RESET_FAVORITE_MOVIES';

import { findIndex, remove } from 'lodash';

export function userFavoriteMoviesReducer(state: ApiMovieObject[] | null = null, action: Action) {
    switch (action.type) {
        case INIT_FAVORITE_MOVIES:
            return Object.assign([], action.payload);

        case ADD_FAVORITE_MOVIE:
            return [...state, action.payload];

        case REMOVE_FAVORITE_MOVIE:
            const newState = Object.assign([], state);
            remove(newState, { id: action.payload });
            return newState;

        case RESET_FAVORITE_MOVIES:
            return null;

        default:
            return state;
    }
}
