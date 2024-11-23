import { Component, Input } from '@angular/core';
import { StaffManageServerComponent } from '../../../../../manage/server/staff/staff.component';
import { PopupService } from '../../../../../../service/popup.service';
import { NotificationService, NotificationType } from '../../../../../../service/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServerStaffPlayer } from '../../../../../../model/server/server';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-rank-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './rank-creator.component.html',
  styleUrl: './rank-creator.component.scss'
})
export class RankCreatorPopupComponent {
  @Input() editMode: boolean = false;

  @Input() name: string = "";
  @Input() color: string = "#ffffff";
  @Input() players: ServerStaffPlayer[] = [];

  @Input() component!: StaffManageServerComponent;

  playerNick: string = "";
  playerDiscord: string = "";
  playerTikTok: string = "";
  playerYouTube: string = "";
  playerInstagram: string = "";

  selectedPlayer: ServerStaffPlayer | null = null;

  constructor(
    private popupService: PopupService,
    private notificationService: NotificationService,
  ) {

  }

  closePopup() {
    this.popupService.closePopup();
  }

  performPlayerAction() {
    if(this.playerNick.length<=0){
      this.notificationService.showNotification("Wprowadź nick gracza!", NotificationType.ERROR);
      return;
    }
    if(this.playerNick.length>16){
      this.notificationService.showNotification("Nick gracza jest zbyt długi!", NotificationType.ERROR);
      return;
    }

    if (this.selectedPlayer) {
      this.selectedPlayer.nick = this.playerNick
      this.selectedPlayer.discord = this.playerDiscord;
      this.selectedPlayer.instagram = this.playerInstagram;
      this.selectedPlayer.tiktok = this.playerTikTok;
      this.selectedPlayer.youtube = this.playerYouTube;

      this.selectedPlayer = null;
    }
    else {
      const index = this.players.length;

      this.players.push({
        nick: this.playerNick,
        discord: this.playerDiscord,
        youtube: this.playerYouTube,
        instagram: this.playerInstagram,
        tiktok: this.playerTikTok,
        index: index,
        id: null
      });
    }

    this.playerNick = "";
    this.playerDiscord = "";
    this.playerYouTube = "";
    this.playerInstagram = "";
    this.playerTikTok = "";
  }

  selectPlayer(player: ServerStaffPlayer) {
    this.playerNick = player.nick;
    this.playerDiscord = player.discord;
    this.playerYouTube = player.youtube;
    this.playerInstagram = player.instagram;
    this.playerTikTok = player.tiktok;

    this.selectedPlayer = player;
  }

  removePlayer() {
    if (this.selectedPlayer) {
      this.players = this.players.filter(player => player.index != this.selectedPlayer!.index);
      this.selectedPlayer = null;

      this.playerNick = "";
      this.playerDiscord = "";
      this.playerYouTube = "";
      this.playerInstagram = "";
      this.playerTikTok = "";
    }
  }

  performAction() {
    this.name = this.name.trim();

    if (this.name.length == 0) {
      this.notificationService.showNotification("Wprowadź nazwę rangi!", NotificationType.ERROR);
      return;
    }

    if (this.editMode) {
      this.component.edit(this.name, this.color, this.players);
    }
    else {
      this.component.createRank(this.name, this.color, this.players);
    }
  }

  onDrop(event: CdkDragDrop<ServerStaffPlayer[]>) {
    const previousIndex = this.players.findIndex((player) => player === event.item.data);
    const currentIndex = event.currentIndex;

    if (previousIndex !== currentIndex) {
      const movedItem = this.players[previousIndex];
      this.players.splice(previousIndex, 1);
      this.players.splice(currentIndex, 0, movedItem);
    }
  }
}
