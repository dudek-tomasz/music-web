import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import {Track} from '../../track';
import {Band} from '../../band';
import {Album} from '../../album';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent {
  textFromSearchbar = '';
  public tracks: Array<Track>;
  public bands: Array<Band>;
  public albums: Array<Album>;

  constructor(private apiService: ApiService, private router: Router) {
  }

  search() {
    this.apiService.getTracks(this.textFromSearchbar).subscribe((data: Array<Track>) => {
      console.log(data);
      this.tracks = data;
    });

    this.apiService.getBands(this.textFromSearchbar).subscribe((data: Array<Band>) => {
      console.log(data);
      this.bands = data;
    });

    this.apiService.getAlbums(this.textFromSearchbar).subscribe((data: Array<Album>) => {
      console.log(data);
      this.albums = data;
    });
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
}
