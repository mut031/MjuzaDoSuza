import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input() result: Item;
  isAdding: boolean = false;

  constructor(private http: HttpClient, private socket: Socket, public toastController: ToastController) { }

  ngOnInit() {
    this.socket.connect();
  }

  async presentToastWithOptions(data) {
    const toast = await this.toastController.create({
      message: data["message"],
      position: 'bottom',
      duration: 2500,
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
    this.isAdding = false;
  }

  addToPlaylist() {
    this.isAdding = true;
    this.http.post(`${environment.SERVER_URL}/playlist`, { item: this.result })
      .subscribe((data) => {
        setTimeout(() => {
          if(data['status'] === 'success')
            this.socket.emit('updatePlaylist');
          this.presentToastWithOptions(data);
        }, 1100);
      });
  }
}
