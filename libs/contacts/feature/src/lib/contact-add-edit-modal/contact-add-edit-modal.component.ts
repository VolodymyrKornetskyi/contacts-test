import { Component, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, of, tap } from 'rxjs';
import { Contact, Positions, PositionsOptions } from '@my-contacts/contacts/domain';
import { ContactsFacadeService } from '@my-contacts/contacts/data-access';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'my-contacts-contact-add-edit-modal',
  templateUrl: './contact-add-edit-modal.component.html',
  styleUrls: ['./contact-add-edit-modal.component.scss'],
})
export class ContactAddEditModalComponent {
  positions = PositionsOptions;
  @ViewChild('uploader') uploader?: FileUpload;

  contact$: Observable<Contact | undefined>;
  form = new FormGroup({
    avatar: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    secondName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    isFavorite: new FormControl(false, { nonNullable: true }),
    position: new FormControl(Positions.Other, { nonNullable: true }),
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });
  contact?: Pick<Contact, 'id'>;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly messageService: MessageService,
    private readonly contactsFacadeService: ContactsFacadeService,
  ) {
    this.contact = this.config.data;
    if (this.contact) {
      this.contact$ = this.contactsFacadeService.getContactById(this.config.data).pipe(tap(
        contact => contact && this.initializeForm(contact)
      ));
    } else {
      this.contact$ = of(undefined);
    }
  }

  closeModal(): void {
    this.ref.close();
  }

  myUploader({ files }: { files: File[] }): void {
    if (files?.length) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.form.patchValue({
          avatar: reader.result as string
        });
        this.uploader?.clear();
      }, false);
      reader.readAsDataURL(files[0])
    }
  }

  initializeForm(contact: Contact): void {
    this.form.patchValue({
      avatar: contact.avatar,
      name: contact.name,
      secondName: contact.secondName,
      email: contact.email,
      position: contact.position,
      city: contact.city,
      isFavorite: contact.isFavorite
    });
  }

  deleteContact(): void {
    this.contact && this.contactsFacadeService.deleteContact({ id: this.contact.id });
    this.closeModal();
  }

  saveContact(): void {
    this.contact ? this.contactsFacadeService.updateContact({
      ...this.contact,
      ...this.form.value
    }) : this.contactsFacadeService.createContact({
      ...this.form.value as any
    });
    this.messageService.add({
      severity: 'success',
      summary: this.contact ? 'Update' : 'Create',
      detail: this.contact ?
        `Contact ${this.form.value.name} updated successfully` :
        `Contact ${this.form.value.name} created successfully`
    });
    this.closeModal();
  }

  toggleFavorite(): void {
    this.form.patchValue({
      isFavorite: !this.form.value.isFavorite
    })
  }
}
