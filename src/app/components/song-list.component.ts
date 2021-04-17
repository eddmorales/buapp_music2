import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';


@Component({
    selector: 'song-list',
    templateUrl: '../views/song-list.html',
    providers: [UserService, SongService]
})

export class SongListComponent implements OnInit{
    public titulo: string;
    public songs: Song[];
    public identity;
    public token;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService
    ) {
        this.titulo = 'Songs';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('song-list component.ts cargado');

        //console.log(this.identity);
        // console.log(this.token);

        //conseguiremos el listado de artistas

        this.getSongs();
    }

    getSongs() {
        this._route.params.forEach( () => {

            this._songService.getSongs(this.token).subscribe(
                response => {
                    let res = <any>response;

                     if(!res.songs) {
                         this._router.navigate(['/']);
                         console.log('No se pudieron obtener las canciones');
                     } else {
                         this.songs = res.songs;
                         console.log(this.songs);
                     }
                }, 
                error => {
                    
                    let errorMessage = <any>error;
    
                    if (errorMessage != null) {
                    //this.alertMessage = error.error.message;
                    console.log(errorMessage);
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
                    console.log('Canción eliminada');
                    this.getSongs();
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