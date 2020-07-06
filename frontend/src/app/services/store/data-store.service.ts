import {Injectable, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Track} from "../../track";
import {ApiService} from "../api.service";
import {Band} from "../../band";
import {Album} from "../../album";
import {UserServiceService} from "../user-service.service";

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {
  // tslint:disable-next-line:variable-name
  private _tracks = new BehaviorSubject([]);
  // tslint:disable-next-line:variable-name
  private _favTracks = new BehaviorSubject([]);
  // tslint:disable-next-line:variable-name
  private _bands = new BehaviorSubject([]);
  // tslint:disable-next-line:variable-name
  private _favBands = new BehaviorSubject([]);
  // tslint:disable-next-line:variable-name
  private _albums = new BehaviorSubject([]);
  private arrTracks: Array<Track> = [];
  private arrBands: Array<Band> = [];

  constructor(private apiService: ApiService, private userService: UserServiceService) {
  }

  public get tracks() {
    return this._tracks.asObservable();
  }

  public get favTracks() {
    return this._favTracks.asObservable();
  }

  public get bands() {
    return this._bands.asObservable();
  }

  public get favBands() {
    return this._favBands.asObservable();
  }

  public get albums() {
    return this._albums.asObservable();
  }

  public setTracks(tracks: Array<Track>) {
    this._tracks.next(tracks);
  }

  public setFavTracks(tracks: Array<Track>) {
    this._favTracks.next(tracks);
  }

  public setBands(bands: Array<Band>) {
    this._bands.next(bands);
  }

  public setFavBands(bands: Array<Band>) {
    this._favBands.next(bands);
  }

  public setAlbums(albums: Array<Album>) {
    this._albums.next(albums);
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

  public getUsersFavTracks(userId: string) {
    this.arrTracks = [];
    this.userService.getUsersFavTracksIdByUserId(userId).subscribe((ids: Array<string>) => {
      console.log(ids);
      ids.forEach(id => {
        this.apiService.getTrackById(id).subscribe((data: Track) => {
          this.arrTracks.push(data);
        });
      });
      this.setFavTracks(this.arrTracks);
    });
  }

  public getUsersFavBands(userId: string) {
    this.arrBands = [];
    this.userService.getUsersFavBandsIdByUserId(userId).subscribe((ids: Array<string>) => {
      // console.log(data);
      ids.forEach(id => {
        this.apiService.getBandById(id).subscribe((data: Band) => {
          this.arrBands.push(data);
        });
        this.setFavBands(this.arrBands);
      });
    });
  }

  public getAlbumsFromDb(query: string) {
    this.apiService.getAlbums(query).subscribe((data: Array<Album>) => {
      // console.log(data);
      this.setAlbums(data);
    });
  }
}
