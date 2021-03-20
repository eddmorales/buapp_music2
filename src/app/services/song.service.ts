import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { GLOBAL } from './global'
import { Song } from '../models/song';

@Injectable()
export class SongService{
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getSong(token, id: String) {
        let options = { headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })};

        return this._http.get(`${this.url}get-song/${id}`, options)
                            .pipe(map( res => res));
    }

    getSongs(token, albumId = null) {
        let options = { headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })};

        if(albumId == null) {
            return this._http.get(`${this.url}get-songs`, options)
                            .pipe(map( res => res));    
        } else {
            return this._http.get(`${this.url}get-songs/${albumId}`, options)
                            .pipe(map( res => res));
        }
    }
  
    addSong(token, song: Song) {
        let params = JSON.stringify(song);
        let options = { headers: new HttpHeaders({
                                    'Content-Type': 'application/json',
                                    'Authorization': token
        })};

        return this._http.post(`${this.url}save-song`, params, options)
                            .pipe(map(res => res));
    }

    editSong(token, id:String,  song: Song) {
        let params = JSON.stringify(song);
        let options = { headers: new HttpHeaders({
                                    'Content-Type': 'application/json',
                                    'Authorization': token
        })};

        return this._http.put(`${this.url}update-song/${id}`, params, options)
                            .pipe(map(res => res));
    }

    deleteSong(token, id: String) {
        let options = { headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })};

        return this._http.delete(`${this.url}delete-song/${id}`, options)
                            .pipe(map( res => res));
    }

}