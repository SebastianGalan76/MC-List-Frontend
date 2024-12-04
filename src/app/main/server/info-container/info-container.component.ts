import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServerPage } from '../serverPage.service';

@Component({
  selector: 'app-server-info-container',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './info-container.component.html',
  styleUrl: './info-container.component.scss'
})
export class ServerInfoContainerComponent extends ServerPage {
  navButtons: any[] = [];

  override onLoad(): void {
    this.navButtons = [];

    this.navButtons.push({
      name: "Informacje",
      destination: '/server/' + this.server.ip + '/info',
      isSelected: false
    });

    if (this.server.description && this.server.description.length > 0) {
      this.navButtons.push({
        name: "Opis",
        destination: '/server/' + this.server.ip + '/description',
        isSelected: false
      });
    }

    if (this.server.subServers != null && this.server.subServers.length > 0) {
      this.navButtons.push({
        name: "Tryby",
        destination: '/server/' + this.server.ip + '/modes',
        isSelected: false
      });
    }

    if (this.server.staff != null && this.server.staff.length > 0) {
      this.navButtons.push({
        name: "Administracja",
        destination: '/server/' + this.server.ip + '/staff',
        isSelected: false
      });
    }

    this.navButtons.push({
      name: "Statystyki",
      destination: '/server/' + this.server.ip + '/statistics',
      isSelected: false
    });

    this.navButtons.push({
      name: "Oceny",
      destination: '/server/' + this.server.ip + '/ratings',
      isSelected: false
    });
  }

  selectButton(button: any) {
    this.navButtons.forEach(button => {
      button.isSelected = false;
    });

    button.isSelected = true;
  }
}
