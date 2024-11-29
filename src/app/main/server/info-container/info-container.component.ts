import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ServerService } from '../../../../service/server/serverService';
import { Server } from '../../../../model/server/server';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-server-info-container',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './info-container.component.html',
  styleUrl: './info-container.component.scss'
})
export class ServerInfoContainerComponent implements OnInit {
  server!: Server;

  navButtons: any[] = [];

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    this.server = this.serverService.server!;

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
