import { Component, EventEmitter } from '@angular/core';
import { AsideMenuManageServerComponent } from './aside-menu/aside-menu.component';
import { User, UserService } from '../../../service/user.service';
import { Server } from '../../../model/server/server';
import { ServerService } from '../../../service/server/serverService';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject, take } from 'rxjs';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [AsideMenuManageServerComponent, RouterOutlet],
  templateUrl: './manageServer.component.html',
  styleUrl: './manageServer.component.scss'
})
export class ManageServerComponent {
  user!: User;
  public server!: Server;
  public serverInitialized = new EventEmitter<void>();

  constructor(
    private userService: UserService,
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    var ip = route.snapshot.paramMap.get('ip') ?? "";

    userService.getUser().subscribe({
      next: (response) => {
        if (response) {
          this.user = response;
        }
        else {
          router.navigate(['/']);
        }
      },
      error: () => router.navigate(['/'])
    })

    serverService.getServer(ip).subscribe({
      next: (response) => {
        if (response) {
          this.server = response;
          this.serverInitialized.emit();
        }
        else {
          router.navigate(['/']);
        }
      },
      error: () => router.navigate(['/'])
    })
  }
}
