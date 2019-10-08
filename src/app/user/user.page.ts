import { Component, OnInit } from '@angular/core';
import { Item } from './item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from "@angular/router";

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
  firstSearch: boolean = true;
  roomId: string;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    if (!this.roomId) {
      this.router.navigate(['/home'])
    }
    this.http.get(`${environment.SERVER_URL}/playlists`)
      .subscribe((data: Array<string>) => {
        if (!data.includes(this.roomId))
          this.router.navigate(['/home'])
      });
  }

  apiUrl(query: string): string {
    let q = query.replace(' ', '%20');
    return `${environment.SERVER_URL}/search?q=${q}`;
    // return `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${q}&key=${environment.YOUTUBE_API_KEY}`;
  }

  // getPlaylistForRoom() {
  //   this.http.get(`${environment.SERVER_URL}/songs/${this.roomId}`)
  //     .subscribe((data: Array<Item>) => {
  //       this.items = data;
  //       this.currentSong = this.items[0];
  //       this.currentSongIndex = 0;
  //     });
  // }

  onSearch(e) {
    this.firstSearch = false;
    this.query = e.target.value;
    this.isSearching = true;
    this.http.get(this.apiUrl(e.target.value))
      .subscribe(data => {
        this.filterResults(data);
        this.isSearching = false;
      });
  }

  filterResults(data: any) {
    this.items = data.results
      .filter(item => item.video.duration !== 'Playlist')
      .map(item => {
        return {
          _id: item.video.id,
          title: item.video.title,
          description: item.uploader.username,
          thumbnail: item.video.thumbnail_src,
          duration: item.video.duration,
          playlists: [{ roomId: this.roomId }]
        }
      });
  }
}
