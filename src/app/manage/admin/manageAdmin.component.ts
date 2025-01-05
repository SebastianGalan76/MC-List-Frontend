import { Component } from '@angular/core';
import { AsideMenuComponent } from "./aside-menu/aside-menu.component";
import { User, UserService } from '../../../service/user.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AsideMenuComponent, RouterOutlet],
  templateUrl: './manageAdmin.component.html',
  styleUrl: './manageAdmin.component.scss'
})
export class ManageAdminComponent {
  user!: User;

  constructor(
    private userService: UserService
  ) {
    this.userService.getUser().subscribe({
      next: (response) => {
        if (response) {
          this.user = response;
        }
      }
    })
  }
}
