import { Component, OnInit, Input } from '@angular/core';
import { MovieObject } from '../../movies.interfaces';
@Component({
    selector: 'movie-card',
    templateUrl: 'movie-card.component.html',
    styleUrls: ['movie-card.component.css']
})

export class MovieCardComponent implements OnInit {
    @Input('movie') movie: MovieObject;
    constructor() { }

    ngOnInit() {
    //
    }
}
