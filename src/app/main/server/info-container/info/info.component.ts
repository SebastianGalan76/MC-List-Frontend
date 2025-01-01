import { Component } from '@angular/core';
import { ServerComponent } from '../../server.component';
import { Utils } from '../../../../../service/utils.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
  providers: [DatePipe],
})
export class ServerInfoComponent {
  versions: string | null = null;
  modes: string | null = null;

  constructor(
    public parent: ServerComponent,
    private datePipe: DatePipe
  ) {
    const versions = Utils.convertVersions(parent.server.versions);
    if (versions) {
      this.versions = versions.replace('-', '&#8722;').replaceAll(' ', '&nbsp;');
    }

    if (parent.server.subServers && parent.server.subServers.length > 0) {
      this.modes = parent.server.subServers.map(server => server.mode.name || null).join(', ');
    }
    else {
      this.modes = parent.server.mode?.name || null;
    }
  }

  getUpdateDateTime(date: Date | null): string | null {
    if (date) {
      const adjustedDate = new Date(date);
      adjustedDate.setMinutes(adjustedDate.getMinutes() - 30);

      return this.convertLocalDateTime(adjustedDate);
    }
    return null;
  }

  convertLocalDateTime(date: Date | null): string | null {
    if (date) {
      return this.datePipe.transform(date, 'dd.MM.yyyy HH:mm');
    }
    return null;
  }
}
