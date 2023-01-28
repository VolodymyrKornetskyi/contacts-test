import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddEditModalComponent } from './contact-add-edit-modal.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContactsFacadeService } from '@my-contacts/contacts/data-access';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';

describe('ContactAddEditModalComponent', () => {
  let component: ContactAddEditModalComponent;
  let fixture: ComponentFixture<ContactAddEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSwitchModule, FileUploadModule, HttpClientModule, DropdownModule, ReactiveFormsModule],
      declarations: [ContactAddEditModalComponent],
      providers: [DynamicDialogRef, DynamicDialogConfig, ContactsFacadeService, MessageService]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
