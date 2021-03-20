import { Component, OnInit} from '@angular/core';
import { UserService } from '../services/user.services';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService] 
})

export class UserEditComponent implements OnInit{
    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public url: string;

    constructor(
        private _userService: UserService
    ) {
        this.titulo = "Actualizar mis datos";

        // localStorage para manejo de sesiones
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('user-edit.component cargado');
    }

    onSubmit() {

        this._userService.updateUser(this.user).subscribe(
            response => {
                let resUpdatedUser = <any>response;
                  if (!resUpdatedUser.user) {
                      this.alertMessage = 'El usuario no se ha actualizado';
                  } else {
                      //this.user = resUpdatedUser.user;
                      localStorage.setItem('identity', JSON.stringify(this.user));
                      document.getElementById("identity_name").innerHTML = this.user.name;

                    if(!this.filesToUpload) {

                    } else {
                        this.makeFileRequest(`${this.url}upload-image-user/${this.user._id}`, [], this.filesToUpload).then(
                            (result: any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));

                                let imagePath = `${this.url}get-image-user/${this.user.image}`;
                                document.getElementById('image-logged').setAttribute('src', imagePath);
                                //console.log(this.user);
                            }
                        );
                    }

                      this.alertMessage = 'Datos actualizados correctamente!';
                  }
            }, 
            error => {
                let errorMessage = <any>error;

                if(errorMessage != null) {
                    this.alertMessage = error.error.message;
                }
            }
        );
    }

    public filesToUpload: Array<any>;

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        let token = this.token;

        return new Promise(function(resolve, reject) {
            let formData: any = new FormData();
            let xhr = new XMLHttpRequest();

            for(let i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}
