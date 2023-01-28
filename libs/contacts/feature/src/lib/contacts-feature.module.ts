import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsLayoutComponent } from './contacts-layout/contacts-layout.component';
import { ContactsHeaderComponent } from './contacts-header/contacts-header.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ContactsDataAccessModule } from '@my-contacts/contacts/data-access';
import { ContactsFeatureRoutingModule } from './contacts-feature-routing.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { ContactAddEditModalComponent } from './contact-add-edit-modal/contact-add-edit-modal.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    HttpClientModule,
    ProgressSpinnerModule,
    ContactsDataAccessModule,
    ContactsFeatureRoutingModule,
    SelectButtonModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MultiSelectModule,
    MenuModule,
    FileUploadModule,
    DropdownModule,
    InputSwitchModule,
  ],
  declarations: [
    ContactsLayoutComponent,
    ContactsHeaderComponent,
    ContactsListComponent,
    ContactAddEditModalComponent,
  ],
  providers: [DialogService]
})
export class ContactsFeatureModule {}
