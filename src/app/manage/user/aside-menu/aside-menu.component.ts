import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User, UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-aside-menu-manage-user',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuManageUserComponent {
  @Input({ required: true }) user!: User;

  isShown: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {

  }

  getConvertedRole() : string{
    switch (this.user.role){
      case 'ADMIN': return 'Administrator';
      case 'HELPER': return 'Pomocnik';
      case 'MODERATOR': return 'Moderator'; 
    }
    return 'Użytkownik';
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/auth/signIn'], { replaceUrl: true });
  }

  toggleMenu(){
    this.isShown = !this.isShown;
  }
}
