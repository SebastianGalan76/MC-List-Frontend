import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from "./shared/notification/notification.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  template: `
  <app-notification />
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'MCList-Frontend';
}
