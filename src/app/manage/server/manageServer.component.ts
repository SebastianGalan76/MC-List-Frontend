import { Component } from '@angular/core';
import { AsideMenuManageServerComponent } from './aside-menu/aside-menu.component';
import { User, UserService } from '../../../service/user.service';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [AsideMenuManageServerComponent],
  templateUrl: './manageServer.component.html',
  styleUrl: './manageServer.component.scss'
})
export class ManageServerComponent {
  user: User | null = null;

  constructor(private userService:UserService) {
    userService.getUser().subscribe((response)=>{
      this.user = response;
    })
  }
}
