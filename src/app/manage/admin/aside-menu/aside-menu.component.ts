import { Component, Input } from '@angular/core';
import { User } from '../../../../service/user.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside-menu-manage-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuComponent {
  @Input({ required: true }) user!: User;

  isShown: boolean = false;

  getConvertedRole(): string {
    switch (this.user.role) {
      case 'ADMIN': return 'Administrator';
      case 'HELPER': return 'Pomocnik';
      case 'MODERATOR': return 'Moderator';
    }
    return 'Użytkownik';
  }

  toggleMenu() {
    this.isShown = !this.isShown;
  }
}
