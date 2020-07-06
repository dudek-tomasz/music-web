import {Component, OnInit} from '@angular/core';
import {UserServiceService} from "../../services/user-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css']
})
export class LoginBoxComponent implements OnInit {
  login: string;
  password: string;

  constructor(private userService: UserServiceService, private router: Router) {
  }

  ngOnInit() {
  }

  logUser() {
    this.userService.loginUser(this.login, this.password).subscribe(res => {
      localStorage.setItem('userData', JSON.stringify(res));
      console.log('retrievedObject: ', JSON.parse(localStorage.getItem('userData')));
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}
