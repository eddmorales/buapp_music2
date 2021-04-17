import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';


@Component({
    selector: 'album-list',
    templateUrl: '../views/album-list.html',
    providers: [UserService, AlbumService]
})

export class AlbumListComponent implements OnInit{
    public titulo: string;
    public albums: Album[];
    public identity;
    public token;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService
    ) {
        this.titulo = 'Albums';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('album-list component.ts cargado');

        //console.log(this.identity);
        // console.log(this.token);

        //conseguiremos el listado de artistas

        this.getAlbums();
    }

    getAlbums() {
        this._route.params.forEach( () => {

            this._albumService.getAlbums(this.token).subscribe(
                response => {
                    let res = <any>response;

                     if(!res.albums) {
                         this._router.navigate(['/']);
                         console.log('No se pudieron obtener los albums');
                     } else {
                         this.albums = res.albums;
                         console.log(this.albums);
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
                    //this.getArtist();
                    console.log('El album se ha eliminado');
                    this.getAlbums();
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