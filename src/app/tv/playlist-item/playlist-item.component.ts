import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/user/item.model';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss'],
})
export class PlaylistItemComponent implements OnInit {
  @Input() result: Item;
  @Output() updatePlaylist: EventEmitter<any> = new EventEmitter();
  @Output() playSong: EventEmitter<any> = new EventEmitter();

  httpOptions;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    console.log(this.result.id);
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: this.result
    };
  }

  removeFromPlaylist() {
    console.log('deleting from playlist')
    this.http.delete(`${environment.SERVER_URL}/playlist`, this.httpOptions)
      .subscribe(data => {
        if (data)
          this.updatePlaylist.emit();
      });
  }

  playMe() {
    this.playSong.emit([this.result.id]);
  }
}
