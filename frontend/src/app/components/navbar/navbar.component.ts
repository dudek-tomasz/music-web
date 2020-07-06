import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataStoreService} from "../../services/store/data-store.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private userId = 'pleaselog';
  private query: string;
  private retrievedData;

  constructor(private router: Router, private dataStore: DataStoreService) {
  }

  ngOnInit() {
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToUserDetails() {
    this.retrievedData = JSON.parse(localStorage.getItem('userData'));
    if (this.retrievedData != null) {
      this.userId = this.retrievedData._id;
    }
    this.query = '/user/' + this.userId;
    this.router.navigate([this.query]);
  }
}
