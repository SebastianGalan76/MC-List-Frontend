import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { Response } from '../../../../model/response/Response';
import { ManageServerComponent } from '../manageServer.component';

import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import { defer, of, take } from 'rxjs';

Quill.register('modules/magicUrl', MagicUrl);

@Component({
  selector: 'app-description-manage-server',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss'
})
export class DescriptionManageServerComponent implements AfterViewInit {
  editorContent: string = "";

  constructor(
    public parent: ManageServerComponent,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  ngAfterViewInit(): void {
    defer(() => this.parent.server ? of(null) : this.parent.serverInitialized).pipe(take(1)).subscribe(() => {
      this.initializeQuill();
    })
  }

  save() {
    this.apiService.post<Response>('/server/' + this.parent.server.id + '/manage/description', this.editorContent, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        this.parent.server.description = this.editorContent;
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  canDeactivate(): boolean {
    if (this.editorContent !== this.parent.server.description) {
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

    if (this.parent.server.description) {
      quillDescription.root.innerHTML = this.parent.server.description;
    }

    quillDescription.on('text-change', () => {
      this.editorContent = quillDescription.root.innerHTML;
    });
  }
}
