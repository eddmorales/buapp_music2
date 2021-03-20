import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';



@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit{
    public titulo: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService
    ) {
        this.titulo = 'Crear nueva canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', ''); 
        this.is_edit = false;
    }

    ngOnInit() {
        console.log('song-add.component.ts cargado');

        // console.log(`Objeto del usuario: ${this.identity}`);
        // console.log(`Token del usuario: ${this.token}`);

        
    }

    onSubmit() {
    
        this._route.params.forEach( (params: Params) => {
            let albumId = params['album'];
            this.song.album = albumId;

            this._songService.addSong(this.token, this.song).subscribe(
                response => {
                    let res = <any>response
                    if(!res.song) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = '¡La canción se ha creado correctamente!';
                        this.song = res.song;
                        this._router.navigate(['/editar-tema', res.song._id]);
                    }
                }, 
                error => {
                    let errorMessage = <any>error;

                    if (errorMessage != null) {

                    this.alertMessage = error.error.message;
                    console.log(error);
                        }
                }
            );
        });
        console.log(this.song);
    };
}
