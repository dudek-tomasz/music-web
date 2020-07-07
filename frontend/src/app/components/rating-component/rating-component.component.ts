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
  public numRates = Math.floor(Math.random() * 100) + 1;
  public whatRate = Math.floor(Math.random() * 5) + 1;
  public rate = 1;
  // public rate = (Math.random() * (1.00 - 5.00) + 5.00).toFixed(2);
  userId = JSON.parse(localStorage.getItem('userData'))._id;
  public isLiked: boolean;
  public isRated: boolean;
  public activeStars = 0;
  public clickedStars = 0;

  constructor(public userService: UserServiceService) {
  }

  ngOnInit() {
    for (let i = 0; i < this.numRates; i++) {
      this.whatRate = Math.floor(Math.random() * 5) + 1;
      this.rate += (this.whatRate / this.numRates);
    }
    this.isRated = false;
  }

  public addRate(rate: number) {
    this.clickedStars = rate;
    if (!this.isRated) {
      this.rate = ((this.rate * this.numRates) + rate) / (this.numRates + 1);
    }
    this.isRated = true;
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
