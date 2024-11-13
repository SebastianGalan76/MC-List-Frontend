import { Component } from '@angular/core';
import { AsideMenuManageServerComponent } from './aside-menu/aside-menu.component';
import { User, UserService } from '../../../service/user.service';
import { Server } from '../../../model/server/server';
import { ServerService } from '../../../service/server/serverService';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [AsideMenuManageServerComponent, RouterOutlet],
  templateUrl: './manageServer.component.html',
  styleUrl: './manageServer.component.scss'
})
export class ManageServerComponent {
  user: User | null = null;
  server: Server | null = null;
  ip: string;

  constructor(
    private userService: UserService,
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ip = this.route.snapshot.paramMap.get('ip') ?? "";

    userService.getUser().subscribe(response => {
      this.user = response;
    })

    serverService.getServer(this.ip).subscribe(response => {
      this.server = response;

      if(!this.server){
        router.navigate(['/']);
      }
    })
  }
}
