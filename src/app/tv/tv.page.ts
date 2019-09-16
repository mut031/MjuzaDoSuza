import { Component, OnInit } from '@angular/core';
import { Item } from '../user/item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getPlaylist();
  }

  getPlaylist() {
    this.http.get(`${environment.SERVER_URL}/playlist`)
      .subscribe((data: Array<Item>) => {
        this.currentSong = data.filter((item, index) => {
          if(item.isCurrent) {
            this.currentSongIndex = index
            return true;
          }
          return false;
        })[0];
        this.items = data;
      });
  }

  updatePlaylist() {
    this.getPlaylist();
  }

  onStateChange(event) {
    this.ytEvent = event.data;
    if (this.ytEvent === 0) {
      this.playNextSong();
    }
  }

  playNextSong() {
    this.currentSong = this.items[++this.currentSongIndex];
    this.items[this.currentSongIndex].isCurrent = true;
    this.items[this.currentSongIndex - 1].isCurrent = false;
    this.player.loadVideoById(this.currentSong.id);
  }

  playSongOnClick(id: string) {
    this.player.loadVideoById(id);
    this.items[this.currentSongIndex].isCurrent = false;
    this.currentSongIndex = this.items.findIndex(item => item.id === id);
    this.items[this.currentSongIndex].isCurrent = true;
  }

  savePlayer(player) {
    this.player = player;
    this.playVideo();
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }
}