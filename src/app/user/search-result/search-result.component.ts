import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input() result: Item;

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  addToPlaylist() {
    this.http.put('http://localhost:3000/playlist', { item: this.result })
      .subscribe(data => console.log('put response', data));
  }
}
