import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';
import { UploadService } from '../services/upload.service';



@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{
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
        private _songService: SongService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', ''); 
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('song-edit.component.ts cargado');

        // console.log(`Objeto del usuario: ${this.identity}`);
        // console.log(`Token del usuario: ${this.token}`);

        this.getSong();
        
    }

    getSong() {
        this._route.params.forEach( (params: Params) => {
            let id = params['id'];

            this._songService.getSong(this.token, id).subscribe(
                response => {
                    let res = <any>response;

                    if(!res.song) {
                        this._router.navigate(['/']);
                    } else {
                        this.song = res.song;
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
    }

    onSubmit() {
    
        this._route.params.forEach( (params: Params) => {
            let id = params['id'];

            this._songService.editSong(this.token, id, this.song).subscribe(
                response => {
                    let res = <any>response;

                    console.log(res.song);
                    if(!res.song) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = '¡La canción se ha actualizado correctamente!';

                        if(!this.filesToUpload) {
                            this._router.navigate(['/album', res.song.album]);
                        } else {
                            this._uploadService.makeFileRequest(`${this.url}upload-file-song/${id}`, [], this.filesToUpload, this.token, 'file')
                            .then(
                                (result) => {
                                    this._router.navigate(['/album', res.song.album]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            )
                        }
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

    public filesToUpload: Array<File>;
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
