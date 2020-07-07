import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Track} from "../track";
import {Band} from "../band";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  public retrievedData = JSON.parse(localStorage.getItem('userData'));
  public token = '';
  public tokenParse;

  constructor(private http: HttpClient) {
  }

  public getUserById(userId: string) {
    return this.http.get('http://localhost:3000/api/users/' + userId);
  }

  public getUsersFavBandsIdByUserId(userId: string) {
    return this.http.get('http://localhost:3000/api/users/' + userId + '/bands');
  }

  public getUsersFavTracksIdByUserId(userId: string) {
    return this.http.get('http://localhost:3000/api/users/' + userId + '/tracks');
  }

  public loginUser(log: string, pass: string) {
    console.log(log, pass);
    return this.http.post('http://localhost:3000/api/users/login', {login: log, password: pass});
  }

  public addToFavTracks(userId: string, trackId: string) {
    console.log(userId, trackId);
    if (this.retrievedData != null) {
      this.token = this.retrievedData.token;
      console.log(this.token);
    }
    console.log('http://localhost:3000/api/users/' + userId + '/favourites/tracks/' + trackId);
    const headerss = new HttpHeaders().set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*').set('Authorization', `Bearer ` + this.token);
    return this.http.put('http://localhost:3000/api/users/' + userId + '/favourites/tracks/' + trackId, {}, {headers: headerss});
  }
}
