import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ServerDataService } from '../../../../service/server/serverDataService';
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
    private serverDataService: ServerDataService
  ) { }

  ngOnInit(): void {
    this.server = this.serverDataService.server!;

    this.navButtons.push({
      name: "Informacje",
      destination: '/server/' + this.server.ip + '/info',
      isSelected: false
    });

    if (this.server.description.length > 0) {
      this.navButtons.push({
        name: "Opis",
        destination: '/server/' + this.server.ip + '/description',
        isSelected: false
      });
    }

    this.navButtons.push({
      name: "Tryby",
      destination: '/server/' + this.server.ip + '/modes',
      isSelected: false
    });

    this.navButtons.push({
      name: "Administracja",
      destination: '/server/' + this.server.ip + '/staff',
      isSelected: false
    });

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
