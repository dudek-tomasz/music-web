import {Component, OnInit} from '@angular/core';
import {switchMap, tap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {UserServiceService} from "../../services/user-service.service";
import {Observable} from "rxjs";
import {Track} from "../../track";
import {Band} from "../../band";
import {SafeResourceUrl} from "@angular/platform-browser";
import {DataStoreService} from "../../services/store/data-store.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user$;
  public isPreviewClicked: boolean;
  public previewedTrackSpotifyId: string;
  previewUrl: SafeResourceUrl = 'https://open.spotify.com/embed/track/';
  public favTracks: Observable<Array<Track>>;
  public favBands: Observable<Array<Band>>;
  public tracksPending = false;
  public bandsPending = false;
  public retrievedData;
  public userId;

  constructor(private userService: UserServiceService, private route: ActivatedRoute, private router: Router, private dataStore: DataStoreService) {
    this.favTracks = this.dataStore.favTracks.pipe(tap(() => {
      this.tracksPending = false;
    }));
    this.favBands = this.dataStore.favBands.pipe(tap(() => {
      this.bandsPending = false;
    }));
    this.getFavs();
  }

  ngOnInit() {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userService.getUserById(params.get('userId')))
    );
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

  loadTrackPreview(event, trackSpotifyId) {
    event.stopPropagation();
    event.preventDefault();
    this.previewedTrackSpotifyId = trackSpotifyId;
    this.isPreviewClicked = true;
  }

  getFavs() {
    this.tracksPending = true;
    this.bandsPending = true;
    this.retrievedData = JSON.parse(localStorage.getItem('userData'));
    if (this.retrievedData != null) {
      this.userId = this.retrievedData._id;
    }
    this.dataStore.getUsersFavTracks(this.userId);
    this.dataStore.getUsersFavBands(this.userId);
  }
}
