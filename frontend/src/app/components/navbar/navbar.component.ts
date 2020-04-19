import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToUserDetails() {
    this.router.navigate(['/user/5e725da960dabb1dd84db6d4']);
  }
}
