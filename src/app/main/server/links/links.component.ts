import { Component, Input } from '@angular/core';
import { Server } from '../../../../model/server/server';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-server-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss'
})
export class ServerLinksComponent {
  @Input({required: true}) server!: Server;
  @Input() style: string = "link-panel";

  classNamesMap = [
    {
      name: ['shop', 'sklep', 'item shop', 'rynek'],
      iconClass: "fa-solid fa-cart-shopping"
    },
    {
      name: ['discord', 'dc'],
      iconClass: "fa-brands fa-discord"
    },
    {
      name: ['fb', 'facebook', 'fanpage'],
      iconClass: "fa-brands fa-square-facebook"
    },
    {
      name: ['instagram', 'insta'],
      iconClass: "fa-brands fa-square-instagram"
    },
    {
      name: ['yt', 'youtube'],
      iconClass: "fa-brands fa-square-youtube"
    },
    {
      name: ['tk', 'tiktok'],
      iconClass: "fa-brands fa-tiktok"
    },
    {
      name: ['strona', 'strona główna', 'homepage', 'stronka'],
      iconClass: "fa-solid fa-house"
    },
    {
      name: ['x', 'twitter'],
      iconClass: "fa-brands fa-x-twitter"
    },
    {
      name: ['regulamin', 'rules'],
      iconClass: "fa-solid fa-scroll"
    },
  ];

  getIcon(name: string) : string {
    var obj = this.classNamesMap.find(className => {
      if(className.name.find(ns => name.toLowerCase() == ns.toLowerCase())){
        return true;
      }
      return false;
    });

    if(obj){
      return obj.iconClass;
    }
    return "fa-solid fa-link";
  }

  getClass(name: string) : string{
    var obj = this.classNamesMap.find(className => {
      if(className.name.find(ns => name.toLowerCase() == ns.toLowerCase())){
        return true;
      }
      return false;
    });

    if(obj){
      return obj.name[0];
    }
    return "";
  }
}
