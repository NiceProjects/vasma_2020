import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isAuthenticated = false;
  constructor(
    private as: AuthService
  ) {
    this.isAuthenticated = this.as.authenticated;
    this.as.onAuthStateUpdate.subscribe(auth => this.isAuthenticated = auth);
  }

  ngOnInit() {
  }

  logout() {
    this.as.logout();
  }

}
