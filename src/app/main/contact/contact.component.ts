import { Component } from '@angular/core';
import { Utils } from '../../../service/utils.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  constructor() {
    Utils.scrollToTop();
  }
}
