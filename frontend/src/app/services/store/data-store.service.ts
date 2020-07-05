import {Injectable, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Track} from "../../track";
import {ApiService} from "../api.service";
import {Band} from "../../band";
import {Album} from "../../album";

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {
  // tslint:disable-next-line:variable-name
  private _tracks = new BehaviorSubject([]);
  // tslint:disable-next-line:variable-name
  private _bands = new BehaviorSubject([]);
  // tslint:disable-next-line:variable-name
  private _albums = new BehaviorSubject([]);

  constructor(private apiService: ApiService) {
  }

  public get tracks() {
    return this._tracks.asObservable();
  }

  public get bands() {
    return this._bands.asObservable();
  }

  public get albums() {
    return this._albums.asObservable();
  }

  public setTracks(tracks: Array<Track>) {
    this._tracks.next(tracks);
  }

  public setBands(bands: Array<Band>) {
    this._bands.next(bands);
  }

  public setAlbums(albums: Array<Album>) {
    this._tracks.next(albums);
  }

  public getTracksFromDb(query: string) {
    this.apiService.getTracks(query).subscribe((data: Array<Track>) => {
      // console.log(data);
      this.setTracks(data);
    });
  }

  public getBandsFromDb(query: string) {
    this.apiService.getBands(query).subscribe((data: Array<Band>) => {
      // console.log(data);
      this.setBands(data);
    });
  }

  public getAlbumsFromDb(query: string) {
    this.apiService.getAlbums(query).subscribe((data: Array<Album>) => {
      // console.log(data);
      this.setAlbums(data);
    });
  }
}
