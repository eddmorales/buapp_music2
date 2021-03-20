import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';


@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
    public album: Album;
    public songs: Song[];
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public titulo;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.titulo = "Detalles del album";
    }

    ngOnInit() {
        console.log('album-detail.component.ts cargado');

        console.log(`Objeto del usuario: ${this.identity}`);
        console.log(`Token del usuario: ${this.token}`);

        this.getAlbum();
    }

    getAlbum() {
        this._route.params.forEach( (params: Params) => {
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    let res = <any>response;
                    
                    if(!res.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = res.album;
                        console.log(this.album);

                        // Obtener todas las canciones del album
                        this._songService.getSongs(this.token, res.album._id).subscribe(
                            response => {
                                let res = <any>response;
                                if(!res.songs) {
                                    this.alertMessage = "Este album no tiene canciones";
                                } else {
                                    this.songs = res.songs;
                                }
                            },
                            error => {
                                let errorMessage = <any>error;
    
                                if (errorMessage != null) {
                
                                //this.alertMessage = error.error.message;
                                console.log(error);
                                }
                            }
                        );
                    }
                },
                error => {
                    let errorMessage = <any>error;
    
                    if (errorMessage != null) {
    
                    //this.alertMessage = error.error.message;
                    console.log(error);
                    }
                }
            );
        });
    }

    public confirmado;
    onDeleteConfirm(id) {
        this.confirmado = id;
    }	

    onCancelSong() {
        this.confirmado = null;
    }

    onDeleteSong(id) {
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                let res = <any>response;

                if(!res.song) {
                    alert("Error en el servidor");
                } else {
                    this.getAlbum();
                }
            },
            error => {
                let errorMessage = <any>error;
    
                    if (errorMessage != null) {
    
                    //this.alertMessage = error.error.message;
                    console.log(error);
                }
            }
        );
    }

    startPlayer(song) {
        let songPlayer = JSON.stringify(song);
        let file_path = `${this.url}get-song-file/${song.file}`;
        let image_path = `${this.url}get-image-album/${song.album.image}`;

        localStorage.setItem('soundSong', songPlayer);

        document.getElementById('mp3-source').setAttribute('src', file_path);
        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();

        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src', image_path);
    }

}