import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input() result: Item;

  constructor(private http: HttpClient, private socket: Socket) { }

  ngOnInit() { 
    this.socket.connect();
  }

  addToPlaylist() {
    this.http.post(`${environment.SERVER_URL}/playlist`, { item: this.result })
      .subscribe(() => this.socket.emit('updatePlaylist'));
  }
}
