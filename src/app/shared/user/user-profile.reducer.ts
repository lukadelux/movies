// counter.ts
import { ActionReducer, Action } from '@ngrx/store';

export const ADD_PROFILE = 'ADD_PROFILE';
export const RESET_PROFILE = 'RESET_PROFILE';

export interface UserProfile {
    avatar: any;
    id: number;
    include_adult: boolean;
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    username: string;
}
export function userProfileReducer(state: UserProfile | null = null, action: Action) {
    switch (action.type) {
        case ADD_PROFILE:
            return Object.assign({}, action.payload);

        case RESET_PROFILE:
            return null;

        default:
            return state;
    }
}
