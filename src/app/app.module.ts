import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { appRoutingProviders, routing } from './app.routing';

// User
import { UserEditComponent } from './components/user-edit.component';
// Home 
import { HomeComponent } from './components/home.component';
// Artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
// Album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
// Song
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
// Player
import { PlayerComponent} from './components/player.component';







@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
