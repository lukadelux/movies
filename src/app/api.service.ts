import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { each, isArray, isNil, isObject, forOwn, isBoolean } from 'lodash';

const API_KEY = 'f179e7c8f063dc0855f96e86ab5431be';
const API_URL = 'https://api.themoviedb.org/3/';

@Injectable()
export class ApiService {

    constructor(private _http: Http) { }

    // wrapper for http get call which maps results and returns Observable
    observableGetCall(route: string, params: any): Observable<any> {
        params = this._urlEncodeData(params);
        return this._http
            .get(`${API_URL}${route}?api_key=${API_KEY}&${params}`)
            .map((res: Response) => res.json());
    }

    // wrapper for http post call which maps results and returns Observable
    observablePostCall(route: string, params: any, item: any): Observable<any> {
        params = this._urlEncodeData(params);
        return this._http
            .post(`${API_URL}${route}?api_key=${API_KEY}&${params}`, item)
            .map((res: Response) => res.json());
    }

    // Encodes url parameters
    private _urlEncodeData(data: {}) {
        const dataItems = [];

        forOwn(data, (value: string, key: any) => {
            if (!isNil(value)) {
                if (isArray(value)) {
                    dataItems.push(this._urlEncodeArray(key, value));
                } else if (isObject(value) && !isArray(value) && !isNil(value)) {
                    try {
                        dataItems.push(encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(value)));
                    } catch (e) {
                        console.error('Could not serialize object.', value);
                    }
                } else if (isBoolean(value)) {
                    dataItems.push(encodeURIComponent(key) + '=' + encodeURIComponent(value ? '1' : '0'));
                } else {
                    dataItems.push(encodeURIComponent(key) + '=' + encodeURIComponent('' + value));
                }
            }
        });

        return dataItems.join('&');
    }

    private _urlEncodeArray(paramName, data: any) {
        const arrayParams = [];

        each(data, (item) => {
            arrayParams.push(encodeURIComponent(paramName) + '[]=' + encodeURIComponent(item));
        });

        return arrayParams.join('&');
    }
}
