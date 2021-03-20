import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';



@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar datos del Artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','',''); 
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('artist-edit.component.ts cargado');

        console.log(`Objeto del usuario: ${this.identity}`);
        console.log(`Token del usuario: ${this.token}`);

        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach( (params: Params) => {
            let id = params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    let res = <any>response;
                    
                    if(!res.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = res.artist;
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

    onSubmit() {
        console.log(this.artist);
        this._route.params.forEach( (params: Params) => {
        let id = params['id'];
            this._artistService.editArtist(this.token, id, this.artist).subscribe(
                response => {
                    let res = <any>response
                    if(!res.artist) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = '¡El artista se ha actualizado correctamente!';
                        
                        if(!this.filesToUpload) {
                            this._router.navigate(['/artista', res.artist._id]);
                        } else {
                        this._uploadService.makeFileRequest(`${this.url}upload-image-artist/${id}`, [], this.filesToUpload, this.token, 'image')
                            .then(
                                (result) => {
                                    this._router.navigate(['/artista', res.artist._id]);
                                },
                                (error) => {
                                    console.log(error);
                                }  
                            );
                        }
                        //this.artist = res.artist;
                        // this._router.navigate(['/editar-artista'], response.artist._id);
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

    public filesToUpload: Array<File>;
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}