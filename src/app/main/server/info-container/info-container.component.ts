import { Component, ComponentFactoryResolver, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServerPage } from '../serverPage.service';
import { ServerService } from '../../../../service/server/serverService';
import { DescriptionComponent } from './description/description.component';

@Component({
  selector: 'app-server-info-container',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './info-container.component.html',
  styleUrl: './info-container.component.scss'
})
export class ServerInfoContainerComponent extends ServerPage {
  navButtons: any[] = [];
  isLoaded: boolean = false;

  @ViewChild('mainContainer') outletContainer!: ElementRef;

  constructor(
    protected override serverService: ServerService,
    protected override route: ActivatedRoute,
    protected override router: Router,
  ) {
    super(route, serverService, router);
  }

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

    const url = this.router.url;
    const parts = url.split('/');
    if (parts.length == 4) {
      const currentSection = parts[parts.length - 1];

      this.navButtons.forEach(button => {
        var destination = button.destination;
        if (destination.includes(currentSection)) {
          button.isSelected = true;
        }
      })
    }
  }

  selectButton(button: any) {
    this.navButtons.forEach(button => {
      button.isSelected = false;
    });

    button.isSelected = true;
  }

  onActivate() {
    setTimeout(() => {
      if (this.isLoaded) {
        if (this.outletContainer) {
          this.outletContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
      else {
        this.isLoaded = true;
      }
    }, 0)
  }
}
