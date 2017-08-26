import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {
    requestToken$: Observable<string>;

    constructor(
        private _apiService: ApiService
    ) {
        this.requestToken$ = this._apiService.observableGetCall('/authentication/token/new', null)
        .map(data => data.request_token);
    }

    authenticateUser(requestToken: string) {
        return this._apiService.observableGetCall('/authentication/session/new', {request_token: requestToken});
    }
}
