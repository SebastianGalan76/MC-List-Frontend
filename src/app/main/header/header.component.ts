import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User, UserService } from '../../../service/user.service';
import { UserSectionComponent } from "./user-section/user-section.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, UserSectionComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user: User | null = null;

  constructor(
    private userService: UserService
  ){ 
    userService.getUser().subscribe(userData => {
      this.user = userData;
    })
  }

  onLogout(){
    this.user = null;
  }
}
