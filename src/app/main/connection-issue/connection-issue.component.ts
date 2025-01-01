import { Component } from '@angular/core';
import { Utils } from '../../../service/utils.service';

@Component({
  selector: 'app-connection-issue',
  standalone: true,
  imports: [],
  templateUrl: './connection-issue.component.html',
  styleUrl: './connection-issue.component.scss'
})
export class ConnectionIssueComponent {
  constructor() {
    Utils.scrollToTop();
  }
}
