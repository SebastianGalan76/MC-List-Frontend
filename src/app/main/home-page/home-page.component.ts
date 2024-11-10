import { Component } from '@angular/core';
import { SearchServerComponent } from "./search-server/search-server.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchServerComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
