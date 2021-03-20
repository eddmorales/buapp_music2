import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { GLOBAL } from './global'
import { Album } from '../models/album';

@Injectable()
export class AlbumService{
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getAlbum(token, id: string) {
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        };

        return this._http.get(`${this.url}get-album/${id}`, options)
                            .pipe(map(res => res));
    }

    getAlbums(token, artistId = null) {
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        };
        
        if(artistId == null) {
            return this._http.get(`${this.url}get-albums/`, options)
                            .pipe(map(res => res));
        } else {
            return this._http.get(`${this.url}get-albums/${artistId}`, options)
                            .pipe(map(res => res));
        }
        
    }

    
    addAlbum(token, album: Album) {
        let params = JSON.stringify(album);
        let options = { headers: new HttpHeaders({
                                    'Content-Type': 'application/json',
                                    'Authorization': token
        })};

        return this._http.post(`${this.url}save-album`, params, options)
                            .pipe(map(res => res));
    }

    editAlbum(token, id:String, album: Album) {
        let params = JSON.stringify(album);
        let options = { headers: new HttpHeaders({
                                    'Content-Type': 'application/json',
                                    'Authorization': token
        })};

        return this._http.put(`${this.url}update-album/${id}`, params, options)
                            .pipe(map(res => res));
    }

    deleteAlbum(token, id: string) {
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        };

        return this._http.delete(`${this.url}delete-album/${id}`, options)
                            .pipe(map(res => res));
    }

}