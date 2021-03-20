import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { GLOBAL } from './global'
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService{
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getArtist(token, id: string) {
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        };

        return this._http.get(`${this.url}get-artist/${id}`, options)
                            .pipe(map(res => res));
    }

    getArtists(token, page) {
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        };

        return this._http.get(`${this.url}get-artists/${page}`, options)
                            .pipe(map(res => res));
    }

    addArtist(token, artist: Artist) {
        let params = JSON.stringify(artist);
        let options = { headers: new HttpHeaders({
                                    'Content-Type': 'application/json',
                                    'Authorization': token
        })};

        return this._http.post(`${this.url}save-artist`, params, options)
                            .pipe(map(res => res));
    }

    editArtist(token, id: string,  artist: Artist) {
        let params = JSON.stringify(artist);
        let options = { headers: new HttpHeaders({
                                    'Content-Type': 'application/json',
                                    'Authorization': token
        })};

        return this._http.put(`${this.url}update-artist/${id}`, params, options)
                            .pipe(map(res => res));
    }

    deleteArtists(token, id: string) {
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        };

        return this._http.delete(`${this.url}delete-artist/${id}`, options)
                            .pipe(map(res => res));
    }
}