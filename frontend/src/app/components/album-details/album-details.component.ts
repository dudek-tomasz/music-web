import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.css']
})
export class AlbumDetailsComponent implements OnInit {
  album$;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.album$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.apiService.getAlbumById(params.get('albumId')))
    );
  }

}
