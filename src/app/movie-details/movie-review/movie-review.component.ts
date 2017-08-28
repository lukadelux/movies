import { Component, OnInit, Input } from '@angular/core';
import { MovieReview } from '../../movies.interfaces';
/*
MovieReviewComponent
@Input() movieReview - movie review information
--- displays movie reviews
 */
@Component({
    selector: 'movie-review',
    templateUrl: 'movie-review.component.html'
})

export class MovieReviewComponent implements OnInit {
    @Input() movieReview: MovieReview;
    constructor() { }

    ngOnInit() { }
}
