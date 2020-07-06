import {Component, HostListener, Pipe, PipeTransform} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import {Track} from '../../track';
import {Band} from '../../band';
import {Album} from '../../album';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {fromEvent, Observable, Subject} from "rxjs";
import {DataStoreService} from "../../services/store/data-store.service";
import {isAsciiHexDigit} from "codelyzer/angular/styles/chars";
import {takeUntil, tap} from "rxjs/operators";

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})


export class DataViewComponent {
  textFromSearchbar = '';
  public tracks: Observable<Array<Track>>;
  public bands: Observable<Array<Band>>;
  public albums: Observable<Array<Album>>;
  previewUrl: SafeResourceUrl = 'https://open.spotify.com/embed/track/';
  public tracksPending = false;
  public bandsPending = false;
  public isSearched: boolean;
  public isPreviewClicked: boolean;
  public previewedTrackSpotifyId: string;
  public yPosition: number;
  public retrievedData = JSON.parse(localStorage.getItem('userData'));

  @HostListener('window:scroll', ['$event'])
  onScroll(e) {
    this.yPosition = e.target.documentElement.scrollTop;
    // console.log(e.target.documentElement.scrollTop);
  }

  // tslint:disable-next-line:max-line-length
  constructor(private apiService: ApiService, private router: Router, private sanitizer: DomSanitizer, private dataStore: DataStoreService) {
    this.tracks = this.dataStore.tracks.pipe(tap(() => {
      this.tracksPending = false;
    }));
    this.bands = this.dataStore.bands.pipe(tap(() => {
      this.bandsPending = false;
    }));
  }

  search() {
    this.isSearched = true;
    this.tracksPending = true;
    this.bandsPending = true;
    this.dataStore.getTracksFromDb(this.textFromSearchbar);
    this.dataStore.getBandsFromDb(this.textFromSearchbar);
  }

  public navigateToTrackDetails(trackId: string) {
    this.router.navigate(['/track/' + trackId]);
  }

  public navigateToAlbumDetails(albumId: string) {
    this.router.navigate(['/album/' + albumId]);
  }

  public navigateToBandDetails(bandId: string) {
    this.router.navigate(['/band/' + bandId]);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

  scrollTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  loadTrackPreview(event, trackSpotifyId) {
    event.stopPropagation();
    event.preventDefault();
    this.previewedTrackSpotifyId = trackSpotifyId;
    this.isPreviewClicked = true;
  }

  flushLocalStorage() {
    localStorage.clear();
    window.location.reload();
  }

  public onRateClick(rate, id: string) {
    console.log('parent ', rate, id);
  }

  public onFavouriteClick(event, id: string) {
    console.log(event, id);
  }
}
