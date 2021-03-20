import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './models/user';
import { UserService } from './services/user.services';
import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'BuApp Music';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor( 
    private _route: ActivatedRoute,
    private _router: Router, 
    private _userService:UserService 
    ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    //console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit() {
    //console.log(this.user);
    // Conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        console.log(response);
        
        let res = <any>response;
        let identity = res.user;

        this.identity = identity;

        if (!identity._id) {
          alert("El usuario no esta correctamente identificado");
        } else {
          // Crear elemento en el localstorage para tener al usuario en sesión
          localStorage.setItem('identity', JSON.stringify(identity));

          //conseguir el token para enviarselo a cada petición http
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              
              let resToken = <any>response;
              let token = resToken.token;
      
              this.token = token;
      
              if (token.length <= 0) {
                alert("El token no se ha generado correctamente");
              } else {
                // Crear elemento en el localstorage para tener al token disponible
                localStorage.setItem('token', token);
      
                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => {
              let errorMessage = <any>error;
      
              if (errorMessage != null) {
      
                this.errorMessage = error.error.message;
                console.log(error);
              }
            }
          );
        }

        //console.log(identity._id);
        
      },
      error => {
        let errorMessage = <any>error;

        if (errorMessage != null) {

          this.errorMessage = error.error.message;
          console.log(error);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity = null;
    this.token = null; 
    this._router.navigate(['/']);
  }

  onSubmitRegister() {
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        let res = <any>response;
        let user = res.user;
        this.user_register = user;

        if (!user._id) {
          this.alertRegister = 'Error al registro';
        } else {
          this.alertRegister = `El registro se ha realizado correctamente, identificate con ${this.user_register.email}`;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        let errorMessage = <any>error;

        if (errorMessage != null) {

          this.alertRegister = error.error.message;
          console.log(error);
        }
      }
    )
  }
}
