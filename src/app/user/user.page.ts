import { Component, OnInit } from '@angular/core';
import { Item } from './item.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  apiUrl: string = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=iron%20maiden&key=AIzaSyDOv8hKWlin7SnRsvyy30jPOuZcGH2-USk';

  items: Item[] = [];
  data: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSearch() {
    this.http.get(this.apiUrl)
    .subscribe(data => this.filterResults(data));
  }

  filterResults(data: any){
    console.log(data.items)
    this.items = data.items
                .filter(item => item.id.kind === 'youtube#video')
                .map(item => ({
                  id: item.id.videoId,
                  title: item.snippet.title,
                  description: item.snippet.description,
                  thumbnail: item.snippet.thumbnails.medium.url
                }));
  }
}
