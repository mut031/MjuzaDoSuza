import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input() result: Item;
  isAdding: boolean = false;

  constructor(private http: HttpClient, public toastController: ToastController) { }

  ngOnInit() {}

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

  addToPlaylist() {
    this.isAdding = true;
    this.http.post(`${environment.SERVER_URL}/song`, { item: this.result })
      .subscribe((data) => {
        setTimeout(() => {
          this.presentToastWithOptions(data);
          this.isAdding = false;
        }, 1100);
      });
  }
}
