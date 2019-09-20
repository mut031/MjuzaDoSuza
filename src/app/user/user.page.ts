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
  isSearching: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  apiUrl(query: string): string {
    let q = query.replace(' ', '%20');
    return `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${q}&key=${environment.YOUTUBE_API_KEY}`;
  }

  onSearch(e) {
    this.query = e.target.value;
    this.isSearching = true;
    this.http.get(this.apiUrl(e.target.value))
      .subscribe(data => {
        this.filterResults(data);
        this.isSearching = false;
      });
  }

  filterResults(data: any) {
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
