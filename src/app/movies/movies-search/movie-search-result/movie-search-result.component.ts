import { Component, Input } from '@angular/core';

export interface MovieSearchResult {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
}

/*
MovieSearchResultComponent
---presentational component for displaying and linking movie results
*/

@Component({
    selector: 'movie-search-result',
    templateUrl: 'movie-search-result.component.html',
    styleUrls: ['movie-search-result.component.css']
})

export class MovieSearchResultComponent {
    @Input() movieResult: MovieSearchResult;
    constructor() { }
}
