import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  public getTracks(query) {
    return this.http.get('http://localhost:3000/api/tracks?name=' + query);
  }
  public getTrackById(id: string) {
      return this.http.get('http://localhost:3000/api/tracks/' + id);
    }
  public getBands(query) {
    return this.http.get('http://localhost:3000/api/bands?name=' + query);
  }
  public getAlbums(query) {
    return this.http.get('http://localhost:3000/api/albums?name=' + query);
  }

  // -------------------Use when you've got your own music database---------------------------
  // public getTracks(query) {
  //   return this.http.get('http://localhost:3000/api/tracks?name=' + query);
  // }
  //
  // public getBands(query) {
  //   return this.http.get('http://localhost:3000/api/bands?name=' + query);
  // }
  //
  // public getAlbums(query) {
  //   return this.http.get('http://localhost:3000/api/albums?name=' + query);
  // }
  //
  // public getTrackById(id: string) {
  //   return this.http.get('http://localhost:3000/api/tracks/' + id);
  // }
  //
  // public getAlbumById(id: string) {
  //   return this.http.get('http://localhost:3000/api/albums/' + id);
  // }
  //
  // public getBandById(id: string) {
  //   return this.http.get('http://localhost:3000/api/bands/' + id);
  // }
  //
  // public getUserById(id: string) {
  //   return this.http.get('http://localhost:3000/api/users/' + id);
  // }
}
