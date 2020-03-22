import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserDetailsComponent} from '../components/user-details/user-details.component';
import {DataViewComponent} from '../components/data-view/data-view.component';
import {BadRequestViewComponent} from '../components/bad-request-view/bad-request-view.component';
import {AlbumDetailsComponent} from '../components/album-details/album-details.component';
import {BandDetailsComponent} from '../components/band-details/band-details.component';
import {TrackDetailsComponent} from '../components/track-details/track-details.component';

const routes: Routes = [
  {
    path: 'user/:userId',
    component: UserDetailsComponent
  },
  {
    path: 'album/:albumId',
    component: AlbumDetailsComponent
  },
  {
    path: 'band/:bandId',
    component: BandDetailsComponent
  },
  {
    path: 'track/:trackId',
    component: TrackDetailsComponent
  },
  {
    path: '',
    component: DataViewComponent
  },
  {
    path: 'home',
    component: DataViewComponent
  },
  {
    path: '**',
    component: BadRequestViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
