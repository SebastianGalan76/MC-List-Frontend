import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Utils } from '../../../../service/utils.service';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.scss'
})
export class Error404Component {
  constructor() {
    Utils.scrollToTop();
  }
}
