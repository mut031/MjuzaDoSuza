import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/user/item.model';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss'],
})
export class PlaylistItemComponent implements OnInit {
  @Input() result: Item;
  @Output() updatePlaylist: EventEmitter<any> = new EventEmitter();

  httpOptions;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: this.result
    };
  }

  removeFromPlaylist() {
    console.log('deleting from playlist')
    this.http.delete('http://localhost:3000/playlist', this.httpOptions)
      .subscribe(data => {
        if (data)
          this.updatePlaylist.emit();
      });
  }
}
