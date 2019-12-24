import { Component, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from "@angular/router"
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastController, ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { LoginPage } from '../login/login.page';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  joinRoomId: string;
  user: string = "";
  sub: Subscription;

  constructor(
    private socket: Socket
    , private router: Router
    , private http: HttpClient
    , private toastController: ToastController
    , private ds: DataService
    , private modalController: ModalController) { }

  ngOnInit() {
    this.socket.connect();
    this.sub = this.ds._username.subscribe(elem => {
      this.user = elem;
    });
  }

  logout() {
    this.user = "";
    localStorage.removeItem('username');
    this.ds.setUsername("");
  }

 

  createRoom() {
    let roomId = this.makeid(5);
    this.http.post(`${environment.SERVER_URL}/playlist`, { item: { title: roomId, description: 'test description', user: this.ds.getUsername() } })
      .subscribe(data => {
        if (data) {
          this.presentToastWithOptions(data);
          this.router.navigate(['/tv', { id: roomId }])
        }
      });
  }

  joinRoom() {
    if (this.joinRoomId) {
      this.http.get(`${environment.SERVER_URL}/playlists`)
        .subscribe((data: any) => {
          console.log(data)
          if (data.filter(item => item.title === this.joinRoomId).length)
            this.router.navigate(['/user', { id: this.joinRoomId }])
        });
    }
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXZY0123456789';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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

  async presentModal(modalName: string) {
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: { 
        modalName
      }
    });
    return await modal.present();
  }

  
  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }


}