import { Component, OnInit } from '@angular/core';
import { Item } from '../user/item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.page.html',
  styleUrls: ['./tv.page.scss'],
})
export class TvPage implements OnInit {
  items: Item[] = [];
  currentSong: Item;

  private player;
  private ytEvent;
  private currentSongIndex;

  constructor(private http: HttpClient, private socket: Socket) { }

  ngOnInit() {
    this.getPlaylist();

    this.socket.connect();
    this.socket.fromEvent('update').subscribe(() =>{
      this.getPlaylist();
    });
  }

  getPlaylist() {
    this.http.get(`${environment.SERVER_URL}/playlist`)
      .subscribe((data: Array<Item>) => {
        this.currentSong = data.find(item => item.isCurrent);
        this.currentSongIndex = data.findIndex(item => item.isCurrent);
        this.items = data;
      });
  }

  updatePlaylist() {
    this.getPlaylist();
  }

  onStateChange(event) {
    this.ytEvent = event.data;
    if (this.ytEvent === 0) {
      this.playNextSong(this.items[this.currentSongIndex + 1] ? this.items[this.currentSongIndex + 1].id : this.items[0].id);
    }
  }

  playNextSong(newSongId: string) {
    this.updateCurrentSong(newSongId);
    this.player.loadVideoById(newSongId);
  }

  savePlayer(player) {
    this.player = player;
    this.playVideo();
  }

  updateCurrentSong(newId: string) {
    // this.http.put(`${environment.SERVER_URL}/playlist`, { newId: newId, currentId: this.currentSong.id })
    //   .subscribe(data => console.log('put response', data));
    this.http.put(`${environment.SERVER_URL}/playlist`, { id: newId, isNew: true })
      .subscribe(data => console.log('put response', data));
    this.http.put(`${environment.SERVER_URL}/playlist`, { id: this.currentSong.id, isNew: false })
      .subscribe(data => console.log('put response', data));
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }
}