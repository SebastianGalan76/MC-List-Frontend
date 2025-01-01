import { Component } from '@angular/core';
import { ManageServerComponent } from '../manageServer.component';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoManageServerComponent {
  constructor(
    public parent: ManageServerComponent
  ) { }
}
