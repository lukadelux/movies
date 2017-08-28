import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserProfile } from '../user/user-profile.reducer';
import { UserService } from '../user/user.service';
/*
HeaderComponent
--- displays header info troughout the application
*/
@Component({
    selector: 'header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit {
    user: UserProfile;
    favorites;
    constructor(
        private _store: Store<UserProfile>,
        private _userService: UserService
    ) { }

    ngOnInit() {
        // Get user profile from store
        this._store.select('userProfile')
            .filter(data => !!data)
            .subscribe((data: UserProfile) => {
                if (data) {
                    this.user = data;
                    console.log('this.user');
                    console.log(this.user);
                }
            });

        // Get user favorite movies from store
        this._store.select('userFavoriteMovies')
            .filter(data => !!data)
            .subscribe((data: any) => {
                if (data) {
                    this.favorites = data;
                    console.log('this.favorites');
                    console.log(this.favorites);
                }
            });
    }

    logout() {
        this._userService.logout();
    }
}
