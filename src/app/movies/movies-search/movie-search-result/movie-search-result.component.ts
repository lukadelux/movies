import { Component, OnInit, Input } from '@angular/core';

export interface MovieSearchResult {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
}


@Component({
    selector: 'movie-search-result',
    templateUrl: 'movie-search-result.component.html',
    styleUrls: ['movie-search-result.component.css']
})

export class MovieSearchResultComponent implements OnInit {
    @Input() movieResult: MovieSearchResult;
    constructor() { }

    ngOnInit() {
        console.log('INIT');
    }
}
