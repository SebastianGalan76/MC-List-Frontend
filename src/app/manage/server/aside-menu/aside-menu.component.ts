import { Component, Input } from '@angular/core';
import { User } from '../../../../service/user.service';

@Component({
  selector: 'app-aside-menu-manage-server',
  standalone: true,
  imports: [],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuManageServerComponent {
  @Input({required: true}) user!: User | null;
}
