import { Component, OnInit } from '@angular/core';
import { Item } from '../user/item.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.page.html',
  styleUrls: ['./tv.page.scss'],
})
export class TvPage implements OnInit {
  items: Item[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getPlaylist();
  }

  getPlaylist() {
    this.http.get('http://localhost:3000/playlist')
      .subscribe((data: Array<Item>) => this.items = data);
  }

  updatePlaylist() {
    this.getPlaylist();
  }
}