import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

/* LoginComponent
--- wraps user login functionality
 */
@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    requestToken: string;

    constructor(
        private _loginService: LoginService
    ) { }

    ngOnInit() {
        this._loginService.requestToken$.subscribe(requestToken => {
            this.requestToken = requestToken;
        });
    }

    logout() {

    }
}
