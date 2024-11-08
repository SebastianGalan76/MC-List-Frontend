import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../model/User';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-user-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-section.component.html',
  styleUrl: './user-section.component.scss'
})
export class UserSectionComponent {
  @Input({required: true}) user!: User;
  @Output() onLogout = new EventEmitter<void>;

  constructor(
    private userService: UserService
  ) {}

  logout(){
    this.userService.logout();
    this.onLogout.emit();
  }
}
