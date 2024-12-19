import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User, UserService } from '../../../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-section',
  standalone: true,
  templateUrl: './user-section.component.html',
  styleUrl: './user-section.component.scss'
})
export class UserSectionComponent {
  @Input({ required: true }) user!: User;
  @Output() onLogout = new EventEmitter<void>;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  logout(event: Event) {
    event.stopPropagation();
    
    this.userService.logout();
    this.onLogout.emit();
  }

  showManagePanel(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/user']);
  }
}
