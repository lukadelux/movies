// counter.ts
import { ActionReducer, Action } from '@ngrx/store';

export const ADD_SESSION = 'ADD_SESSION';
export const DECREMENT = 'DECREMENT';
export const RESET_SESSION = 'RESET_SESSION';

export interface UserSession {
    session_id: string;
}

export function userSessionReducer(state: UserSession | null = null, action: Action) {
    switch (action.type) {
        case ADD_SESSION:
            const newSate = {
                session_id: action.payload
            }
            return Object.assign({}, state, newSate);;

        case RESET_SESSION:
            return null;

        default:
            return state;
    }
}
