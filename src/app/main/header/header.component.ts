import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User, UserService } from '../../../service/user.service';
import { UserSectionComponent } from "./user-section/user-section.component";
import { ApiService } from '../../../service/api.service';
import { HttpOptions } from '../../../model/HttpOptions';
import { ObjectResponse } from '../../../model/response/ObjectResponse';

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
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
  ) {
    userService.getUser().subscribe(userData => {
      this.user = userData;
    })
  }

  onLogout() {
    this.user = null;
  }

  getRandomServer() {
    this.apiService.get<ObjectResponse<string>>('/random', {}).subscribe({
      next: (response) => {
        this.router.navigate(['/server', response.object]);
      }
    })
  }
}
