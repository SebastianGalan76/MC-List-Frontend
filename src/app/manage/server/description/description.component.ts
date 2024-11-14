import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Server } from '../../../../model/server/server';
import { ServerService } from '../../../../service/server/serverService';
import { ApiService } from '../../../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService, NotificationType } from '../../../../service/notification.service';

import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import { Response } from '../../../../model/response/Response';

Quill.register('modules/magicUrl', MagicUrl);

@Component({
  selector: 'app-description-manage-server',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss'
})
export class DescriptionManageServerComponent implements AfterViewInit {
  server!: Server;

  editorContent: string = "";

  constructor(
    private serverService: ServerService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngAfterViewInit(): void {
    var ip = this.route.parent?.snapshot.paramMap.get('ip') || '';

    this.serverService.getServer(ip).subscribe(server => {
      this.server = server!;

      if(this.server){
        this.initializeQuill();
      }
    });
  }

  save() {
    this.apiService.post<Response>('/server/'+this.server.id+'/manage/description', this.editorContent, {withCredentials: true}).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        this.server.description = this.editorContent;
      },
      error: (response) => {
        if(response.error){
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  canDeactivate(): boolean {
    if (this.editorContent !== this.server.description) {
      return confirm('Masz niezapisane zmiany! Czy na pewno chcesz opuścić tę stronę?');
    }
    return true;
  }

  initializeQuill(): void {
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      ['link', 'image', 'video'],

      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],

      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'header': [1, 2, 3, false] }],

      [{ 'color': [] }, { 'background': [] }],

      ['clean']
    ];

    var quillDescription = new Quill('#description-editor', {
      theme: 'snow',
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: imageHandler
          }
        },
        clipboard: {
          matchVisual: false
        },
        magicUrl: true,
      },
    });

    quillDescription.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      delta.forEach(e => {
        if (e && e.attributes) {
          e.attributes['color'] = '';
          e.attributes['background'] = '';
        }
      });
      return delta;
    });

    function imageHandler() {
      var range = quillDescription.getSelection();
      var value = prompt('Wprowadź adres URL grafiki');
      if (value) {
        quillDescription.insertEmbed(range!.index, 'image', value, Quill.sources.USER);
      }
    }

    if (this.server.description) {
      quillDescription.root.innerHTML = this.server.description;
    }

    quillDescription.on('text-change', () => {
      this.editorContent = quillDescription.root.innerHTML;
    });
  }
}
