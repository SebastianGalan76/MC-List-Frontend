import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OptionValue, SelectComponent } from "../../../shared/input/select/select.component";
import { ServerVersionService } from '../../../../service/serverVersion.service';
import { ServerModeService } from '../../../../service/serverMode.service';
import { SearchServerService } from '../../../../service/searchServer.service';

@Component({
  selector: 'app-search-server',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  templateUrl: './search-server.component.html',
  styleUrl: './search-server.component.scss'
})
export class SearchServerComponent {
  sthChange: boolean = false;

  searchInput: string = "";
  premium: boolean = false;
  mods: boolean = false;

  versionOptions: OptionValue[] = [];
  modeOptions: OptionValue[] = [];

  constructor(
    private searchServerService: SearchServerService,
    private serverVersionService: ServerVersionService,
    private serverModeService: ServerModeService
  ) {
    serverVersionService.getVersionList().subscribe(list => {
      list.forEach(item => {
        this.versionOptions.push({
          item: item,
          isSelected: false,
          isVisibled: true,
        })
      })
    });

    serverModeService.getVersionList().subscribe(list => {
      list.forEach(item => {
        this.modeOptions.push({
          item: item,
          isSelected: false,
          isVisibled: true,
        })
      })
    })
  }

  search() {
    this.sthChange = false;

    var selectedVersion = this.versionOptions.find(option => option.isSelected)?.item || null;
    var selectedMode = this.modeOptions.find(option => option.isSelected)?.item || null;

    var searchDto = {
      name: this.searchInput,
      version: selectedVersion,
      mode: selectedMode,
      premium: this.premium,
      mods: this.mods
    }

    this.searchServerService.searchServer(searchDto, 1);
  }
}
