import { Component } from '@angular/core';
import { User, UserService } from '../../../service/user.service';
import { AsideMenuManageUserComponent } from './aside-menu/aside-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [AsideMenuManageUserComponent, RouterOutlet],
  templateUrl: './manageUser.component.html',
  styleUrl: './manageUser.component.scss'
})
export class ManageUserComponent {
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
