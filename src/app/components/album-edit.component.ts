import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { UploadService } from '../services/upload.service';

import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';


@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{
    public titulo: string;
    public album: Album;  
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', '', '', ''); 
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('album-edit.component.ts cargado');

        console.log(`Objeto del usuario: ${this.identity}`);
        console.log(`Token del usuario: ${this.token}`);

        this.getAlbum();
    }

    getAlbum() {
        this._route.params.forEach( (params: Params) => {
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    let res = <any>response
                    if(!res.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = res.album;
                        console.log(this.album);
                    }
                }, 
                error => {
                    let errorMessage = <any>error;
    
                    if (errorMessage != null) {
                    console.log(error);
                        }
                } 
            ); 
        });
    }

    onSubmit(){
        this._route.params.forEach( (params: Params) => {
            let id = params['id'];

            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                response => {
                    let res = <any>response;

                    console.log(res);
                    if(!res.albumUpdated) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        if(!this.filesToUpload) {
                            this._router.navigate(['/artista', res.albumUpdated.artist]);
                        } else {
                            this.alertMessage = '¡El album se ha actualizado correctamente!';

                            this._uploadService.makeFileRequest(`${this.url}upload-image-album/${id}`, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/artista', res.albumUpdated.artist]);
                                    },
                                    (error) => {
                                        console.log(error);
                                    }  
                                );
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
        console.log(this.album);
    }

    public filesToUpload: Array<File>;
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
