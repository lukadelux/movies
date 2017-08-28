import { Injectable } from '@angular/core';
import { findIndex, each, assign, reverse } from 'lodash';
import { ApiService } from '../../api.service';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MoviesListService {
    private page$: BehaviorSubject<number> = new BehaviorSubject(1);
    private genre$: BehaviorSubject<string | null> = new BehaviorSubject(null);
    private year$: BehaviorSubject<number | null> = new BehaviorSubject(null);
    private sortBy$: BehaviorSubject<string> = new BehaviorSubject('popularity.desc');
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private searchTerms$: BehaviorSubject<any> = new BehaviorSubject({});
    private searchTerms = <any>{};
    public movies$: Observable<any>;
    public genresList$: Observable<any>;
    private previousGenre: string;
    private previousYear: number;
    private previousSortBy: string;

    constructor(private _apiService: ApiService) {
        // movie stream that gets movies from API based on current page, genre, year and sortby properties
        this.movies$ = combineLatest(
            this.page$,
            this.genre$,
            this.year$,
            this.sortBy$
        )
            .switchMap(([page, genre, year, sortBy]) => {
                const params: any = {
                    page: page
                };
                if (genre) {
                    if (this.previousGenre && this.previousGenre !== genre) {
                        params.page = 1;
                    }
                    params.with_genres = genre;
                    this.previousGenre = genre;
                }
                if (year) {
                    if (this.previousYear && this.previousYear !== year) {
                        params.page = 1;
                    }
                    params.primary_release_year = year;
                    this.previousYear = year;
                }
                if (sortBy) {
                    if (this.previousSortBy && this.previousSortBy !== sortBy) {
                        params.page = 1;
                    }
                    params.sort_by = sortBy;
                    this.previousSortBy = sortBy;
                }
                return this._apiService.observableGetCall('discover/movie', params);
            });

        this.genresList$ = this._apiService.observableGetCall('genre/movie/list', {})
            .map(data => data.genres);
    }

    public changePage(pageNo: number): void {
        this.page$.next(pageNo);
    }

    public changeGenre(genre: string): void {
        this.genre$.next(genre);
    }

    public changeYear(year: number): void {
        this.year$.next(year);
    }

    public changeSortBy(sortBy: string): void {
        this.sortBy$.next(sortBy);
    }


    public generateYears(startingFrom: number): number[] {
        let currentYear = startingFrom;
        const years = [];
        while (currentYear <= 2017) {
            years.push(currentYear);
            currentYear++;
        }
        return reverse(years);
    }
}
