import { Component } from '@angular/core';
import { ServerComponent } from '../../server.component';
import { Utils } from '../../../../../service/utils.service';
import { ServerVersion } from '../../../../../service/serverVersion.service';

@Component({
  selector: 'app-modes',
  standalone: true,
  imports: [],
  templateUrl: './modes.component.html',
  styleUrl: './modes.component.scss'
})
export class ServerModesComponent {
  constructor(
    public parent: ServerComponent
  ) {

  }

  getConvertedVersion(versions: ServerVersion[]) {
    return Utils.convertVersions(versions);
  }
}
