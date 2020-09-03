import { Component, OnInit } from '@angular/core';
import { Item } from '../user/item.model';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.page.html',
  styleUrls: ['./tv.page.scss'],
})
export class TvPage implements OnInit {
  shuffle: boolean = true;
  items: Item[] = [];
  playlist: Item[] = [];
  currentSong: Item;
  roomId: string;
  showPlayer: boolean = true;
  showAllSongs: boolean = false;

  a: string = 'url';
  qrUrl : string = '';

  private player;
  private ytEvent;
  private currentSongIndex;

  constructor(
    private ds: DataService, private http: HttpClient, private socket: Socket, private route: ActivatedRoute, private router: Router, public toastController: ToastController) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    
    this.http.get(`${environment.SERVER_URL}/playlists`)
      .subscribe((data: any) => {
        if (!data.filter(item => item.title === this.roomId).length)
          this.router.navigate(['/home'])
      });

    this.socket.connect();
    this.socket.emit('createRoom', { roomId: this.roomId });
    this.socket.fromEvent('update').subscribe(() => {
      this.getPlaylistForRoom();
    });
    this.getPlaylistForRoom();
  }

  getPlaylistForRoom() {
    this.http.get(`${environment.SERVER_URL}/songs/${this.roomId}`)
      .subscribe((data: Array<Item>) => {
        this.items = data;
        this.currentSong = this.items.filter(item => item.playlists.find(item => item.roomId === this.roomId && item.isCurrent))[0];
        this.currentSongIndex = this.items.indexOf(this.currentSong);
        this.playlist = this.items.filter((value, index) => index + 2 >= this.currentSongIndex);
      });
  }

  showHideSongs() {
    if(this.showAllSongs)
      this.playlist = this.items;
    else 
      this.playlist = this.items.filter((value, index) => index + 2 >= this.currentSongIndex);
  }

  onStateChange(event) {
    this.ytEvent = event.data;
    if (this.ytEvent === 0) {
      this.playNextSong(this.shuffle ? (this.items[Math.floor(Math.random() * this.items.length)]._id) : (this.items[this.currentSongIndex + 1] ? this.items[this.currentSongIndex + 1]._id : this.items[0]._id) );
    }
  }

  removeSongFromPlaylist(song: Item) {
    if (song._id !== this.currentSong._id) {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: { roomId: this.roomId, song: song }
      };
      this.http.delete(`${environment.SERVER_URL}/song`, httpOptions)
        .subscribe(data => this.presentToastWithOptions(data));
    }
  }

  playNextSong(newSongId: string) {
    if (newSongId !== this.currentSong._id) {
      this.updateCurrentSong(newSongId);
      this.player.loadVideoById(newSongId, 20);
    }
  }

  updateCurrentSong(newId: string) {
    let songs = this.items.filter(item => item._id === newId || item._id === this.currentSong._id)
      .map(item => {
        let index = item.playlists.findIndex(item => item.roomId === this.roomId);
        item.playlists[index].isCurrent = !item.playlists[index].isCurrent;
        return item;
      });
    this.http.put(`${environment.SERVER_URL}/song`, { songs: songs, roomId: this.roomId })
      .subscribe(data => this.presentToastWithOptions(data));
  }

  savePlayer(player) {
    this.player = player;
    this.playVideo();
  }

  playVideo() {
    this.player.seekTo(20);
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

  async presentToastWithOptions(data) {
    const toast = await this.toastController.create({
      message: data["message"],
      position: 'bottom',
      duration: 2000,
      color: data["status"],
      buttons: [
        {
          side: 'start',
          icon: 'musical-notes',
        },
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}