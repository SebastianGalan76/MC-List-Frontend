import { Component } from '@angular/core';
import { Utils } from '../../../service/utils.service';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss'
})
export class RewardsComponent {
  constructor() {
    Utils.scrollToTop();
  }
}
