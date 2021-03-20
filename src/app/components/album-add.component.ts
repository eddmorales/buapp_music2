import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';


@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
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
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.titulo = 'Crear nuevo album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', '', '', ''); 
        this.is_edit = false;
    }

    ngOnInit() {
        console.log('album-add.component.ts cargado');

        console.log(`Objeto del usuario: ${this.identity}`);
        console.log(`Token del usuario: ${this.token}`);

        
    }

    onSubmit(){
        this._route.params.forEach( (params: Params) => {
            let artistId = params['artist'];
            this.album.artist = artistId;

            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {
                    let res = <any>response
                    if(!res.album) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = '¡El album se ha creado correctamente!';
                        this.album = res.album;
                        this._router.navigate(['/editar-album', res.album._id]);
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
}
