import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  isCollapsed: boolean = true;
  
  constructor(private auth: AuthService, private router: Router){

  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
