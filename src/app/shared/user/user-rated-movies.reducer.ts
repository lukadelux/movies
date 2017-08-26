// counter.ts
import { ActionReducer, Action } from '@ngrx/store';
import { ApiMovieObject } from '../../movies.interfaces';
export const INIT_RATED_MOVIES = 'INIT_RATED_MOVIES';
export const ADD_RATED_MOVIES = 'ADD_RATED_MOVIES';
export const UPDATE_RATING = 'UPDATE_RATING';
export const RESET_RATED_MOVIES = 'RESET_RATED_MOVIES';

import { findIndex, remove } from 'lodash';

export function userRatedMoviesReducer(state: ApiMovieObject[] | null = null, action: Action) {
    switch (action.type) {
        case INIT_RATED_MOVIES:
            return Object.assign([], action.payload);

        case ADD_RATED_MOVIES:
            return [...state, ...action.payload];

        case UPDATE_RATING:
            const newState = Object.assign([], state);
            let ratedMovieIndex = findIndex(newState, { id: action.payload.id });
            newState[ratedMovieIndex].rating = action.payload.rate;
            console.log('newState');
            console.log(newState);
            return newState;

        case RESET_RATED_MOVIES:
            return null;

        default:
            return state;
    }
}
