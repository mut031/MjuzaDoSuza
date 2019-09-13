import { Component, OnInit } from '@angular/core';
import { Item } from './item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  query: string;

  items: Item[] = [];
  data: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  get apiUrl(): string {
    return `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${this.query}&key=${environment.YOUTUBE_API_KEY}`;
  }

  onSearch() {
    console.log(this.query)
    console.log(this.apiUrl)
    this.http.get(this.apiUrl)
      .subscribe(data => this.filterResults(data));
  }

  filterResults(data: any) {
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
