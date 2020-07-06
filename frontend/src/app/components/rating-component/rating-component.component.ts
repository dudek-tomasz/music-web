import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {UserServiceService} from "../../services/user-service.service";

@Component({
  selector: 'app-rating-component',
  templateUrl: './rating-component.component.html',
  styleUrls: ['./rating-component.component.css']
})
export class RatingComponentComponent implements OnInit {
  @Output() onFavouriteClick = new EventEmitter();
  @Output() onRateClick = new EventEmitter();
  public checkedRadio;
  public rate = (Math.random() * (1.00 - 5.00) + 5.00).toFixed(2);
  public userId = JSON.parse(localStorage.getItem('userData'))._id;
  public isLiked: boolean;
  public activeStars = 0;
  public clickedStars = 0;

  constructor(public userService: UserServiceService) {
  }

  ngOnInit() {
  }

  public addRate(rate: number) {
    this.clickedStars = rate;
    this.onRateClick.emit(rate);
    console.log(rate);
  }

  public enterOnStar(starId) {
    this.activeStars = starId;
  }

  public leaveOnStar() {
    this.activeStars = 0;
  }

  public addToFavourites() {
    this.isLiked = true;
    this.onFavouriteClick.emit('clicked');
  }
}
