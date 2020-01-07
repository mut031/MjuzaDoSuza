import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import { Item } from '../user/item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @Input('modalName') modalName: string;
  myRooms = [];
  username: string = "";
  password: string = "";
  user: string = "";
  constructor(
    private toastController: ToastController
    , private http: HttpClient
    , private ds: DataService
    , private modalController: ModalController
    , private router: Router
  ) { }

  ngOnInit() {
    if(this.modalName === 'My rooms') {
      this.getMyRooms();
    }
  }

  getMyRooms() {
    this.http.get(`${environment.SERVER_URL}/playlists`)
        .subscribe((data: any) => {
          this.myRooms = data.filter(item => item.user === this.ds.getUsername());
        });
  }

  register() {
    if (!this.username || !this.password) {
      this.presentToastWithOptions({ message: "Username and password required.", status: "danger" });
      return;
    }
    this.http.post(`${environment.SERVER_URL}/user`, { user: { username: this.username, password: this.password } }).subscribe((data: { message: string, status: string }) => {
      if (data.status !== 'danger') {
        this.ds.setIsLogged(true);
        this.ds.setUsername(this.username);
        localStorage.setItem('username', this.username);
        this.user = this.username;

        this.username = "";
        this.password = "";
        this.presentToastWithOptions(data);
        this.modalController.dismiss();
      }
      else
        this.presentToastWithOptions({ message: "Username already taken.", status: "danger" });
    });
  }

  login() {
    if (!this.username || !this.password) {
      this.presentToastWithOptions({ message: "Username and password required.", status: "danger" });
      return;
    }
    this.http.get(`${environment.SERVER_URL}/user/${this.username}`)
      .subscribe((data: any) => {
        if (data) {
          if (data.password === this.password) {
            this.ds.setIsLogged(true);
            this.ds.setUsername(this.username);
            localStorage.setItem('username', this.username);
            this.user = this.username;
            this.username = "";
            this.password = "";
            this.modalController.dismiss();
            return;
          }
        }
        this.presentToastWithOptions({ message: "Username doesn't exist.", status: "danger" });
      });
  }

  openRoom(roomId: string){
    this.modalController.dismiss();
    this.router.navigate(['/tv', { id: roomId }]);
  }

  deleteRoom(roomId: string){
    console.log(roomId)
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {roomId: roomId} 
    };
    this.http.delete(`${environment.SERVER_URL}/playlists`, httpOptions)
        .subscribe(data => {
          this.presentToastWithOptions(data);
          this.getMyRooms();
        });
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
