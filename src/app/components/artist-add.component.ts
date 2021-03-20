import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';


@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
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
        private _artistService: ArtistService
    ) {
        this.titulo = 'Crear Nuevo Artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','',''); 
        this.is_edit = false;
    }

    ngOnInit() {
        console.log('artist-add.component.ts cargado');

        //console.log(this.identity);
        console.log(this.token);

        //conseguiremos el listado de artistas
    }

    onSubmit() {
        console.log(this.artist);
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => {
                let res = <any>response
                if(!res.artist) {
                    this.alertMessage = 'Error en el servidor';
                } else {
                    this.alertMessage = '¡El artista se ha creado correctamente!';
                    this.artist = res.artist;
                    this._router.navigate(['/editar-artista', res.artist._id]);
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
    }
}