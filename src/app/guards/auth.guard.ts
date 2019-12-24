import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private ds: DataService, private http: HttpClient) {
    
  }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      let roomId = route.paramMap.get('id');
      this.http.get(`${environment.SERVER_URL}/playlists/${roomId}`)
      .subscribe((data: any) => {
        if(!roomId)  {
          return false;
        }
        if(data && data.user.length > 0 && data.user !== localStorage.getItem('username')) {
          return false;
        }
      });  
    return true;
  }
}
