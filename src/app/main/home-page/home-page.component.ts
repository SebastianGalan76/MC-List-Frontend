import { Component } from '@angular/core';
import { SearchServerComponent } from "./search-server/search-server.component";
import { ServerListComponent } from "./server-list/server-list.component";
import { BigBannerComponent } from "./banner/big/big.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchServerComponent, ServerListComponent, BigBannerComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
