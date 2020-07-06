import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Track} from "../track";
import {Band} from "../band";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  public arrTracks: Array<string> = [];
  public arrBands: Array<string> = [];

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
    this.arrTracks = [];
    this.http.get('http://localhost:3000/api/users/' + userId + '/tracks').subscribe((data: Array<string>) => {
      data.forEach(el => {
        this.arrTracks.push(el);
      });
      this.arrTracks.push(trackId);
    });
    return this.http.put('http://localhost:3000/api/users/' + userId, {favTracks: this.arrTracks});
  }
}
