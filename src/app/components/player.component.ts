import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';


@Component({
    selector: 'player',
    template: `
        <div class="album-image">
            <span *ngIf="song.album">
                <img id="play-image-album" src="{{url + 'get-image-album/' + song.album.image}}">
            </span>
            <span *ngIf="!song.album">
                <img id="play-image-album" src="assets/imgs/Music_Outline.png">
            </span>
        </div>

        <div class="audio-file">
            <p>Reproduciendo
                 <span id="play-song-title">
                    {{song.name}} 
                </span>
                 <span id="play-song-artist">
                    <span *ngIf="song.artist">
                        {{song.album.artist.name}}
                    </span>
                </span>
            </p>
            <audio controls id="player">
                <source id="mp3-source" src="{{ url + 'get-song-file/' + song.file}}" type="audio/mpeg">
            </audio>
        </div>
    `
})

export class PlayerComponent implements OnInit{
    public url: String;
    public song;

    constructor() {
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('player cargado');

        let song = JSON.parse(localStorage.getItem('soundSong'));

        if(song) {
            this.song = song;
        } else {
            this.song = new Song(1, '', '', '', '');
        }
    }
}