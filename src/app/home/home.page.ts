import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from "@angular/router"
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  joinRoomId: string;

  constructor(private socket: Socket, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.socket.connect();
  }

  createRoom() {
    this.router.navigate(['/tv', { id: this.makeid(5) }])
  }

  joinRoom() {
    if (this.joinRoomId) {
      this.http.get(`${environment.SERVER_URL}/playlists`)
        .subscribe((data: Array<string>) => {
          if (data.includes(this.joinRoomId))
            this.router.navigate(['/user', { id: this.joinRoomId }])
        });
    }
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
