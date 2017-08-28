import { Component, Input } from '@angular/core';
import { MovieObject } from '../../movies.interfaces';
@Component({
    selector: 'movie-card',
    templateUrl: 'movie-card.component.html',
    styleUrls: ['movie-card.component.css']
})
/*
MovieCardComponent
--- presentational component for displaying movie cards and linking to single movie page
*/
export class MovieCardComponent {
    @Input('movie') movie: MovieObject;
    constructor() { }
}
