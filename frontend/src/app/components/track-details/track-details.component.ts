import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Track} from '../../track';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.css']
})
export class TrackDetailsComponent implements OnInit {
  track$;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    // this.track$ = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) =>
    //     this.apiService.getTrackById(params.get('trackId')))
    // );
  }

}
