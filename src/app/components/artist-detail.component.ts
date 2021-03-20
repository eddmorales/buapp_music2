import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';


@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit{
    public artist: Artist;
    public albums: Album[];
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('artist-edit.component.ts cargado');

        // console.log(`Objeto del usuario: ${this.identity}`);
        // console.log(`Token del usuario: ${this.token}`);

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

                        this._albumService.getAlbums(this.token, res.artist._id).subscribe(
                            response => {
                                let res = <any>response;
                                if(!res.albums) {
                                    this.alertMessage = "Este artista no tiene albums";
                                } else {
                                    this.albums = res.albums;
                                    //console.log(this.albums);
                                }
                            }, error => {
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

    onCancelAlbum() {
        this.confirmado = null;
    }

    onDeleteAlbum(id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                let res = <any>response;

                if(!res.album) {
                    alert('Error en el servidor');
                } else {
                    this.getArtist();
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

}