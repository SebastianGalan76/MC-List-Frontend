import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from "./shared/notification/notification.component";
import { PopupComponent } from "./shared/popup/popup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent, PopupComponent],
  template: `
  <app-notification />
  <app-popup />
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'MCList-Frontend';
}
