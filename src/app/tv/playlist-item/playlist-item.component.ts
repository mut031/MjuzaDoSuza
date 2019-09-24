import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/user/item.model';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

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

  constructor(private http: HttpClient, public toastController: ToastController) { }

  ngOnInit() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: this.result
    };
  }

  removeFromPlaylist() {
    this.http.delete(`${environment.SERVER_URL}/playlist`, this.httpOptions)
      .subscribe(data => this.presentToastWithOptions(data));
  }

  playMe() {
    this.playSong.emit([this.result.id]);
  }

  async presentToastWithOptions(data) {
    const toast = await this.toastController.create({
      message: data["message"],
      position: 'bottom',
      duration: 2000,
      color: data["status"],
      buttons: [
        {
          side: 'start',
          icon: 'musical-notes',
        },
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}