import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Contact, Phone } from '@my-contacts/contacts/domain';
import { MenuItem } from 'primeng/api';
import { ContactsFacadeService } from '@my-contacts/contacts/data-access';
import { DialogService } from 'primeng/dynamicdialog';
import { ContactAddEditModalComponent } from '../contact-add-edit-modal/contact-add-edit-modal.component';

@Component({
  selector: 'contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsListComponent {
  @Input() contacts: Contact[] = [];

  menuContactSelected?: Contact;
  items: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-cog',
      command: () => {
        if (this.menuContactSelected) {
          this.dialogService.open(ContactAddEditModalComponent,
            {
              styleClass: 'add-edit-contact',
              showHeader: false,
              data: {
                id: this.menuContactSelected.id
              }
            }
          );
        }
      }
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.menuContactSelected &&
        this.contactsFacadeService.deleteContact(this.menuContactSelected)
    },
    {
      label: 'Favorites',
      icon: 'pi pi-heart',
      command: () => this.menuContactSelected &&
        this.contactsFacadeService[
          this.menuContactSelected.isFavorite ? 'removeContactFromFavorite' : 'markContactAsFavorite'
        ](this.menuContactSelected)
    }
  ];

  constructor(
    private readonly dialogService: DialogService,
    private readonly contactsFacadeService: ContactsFacadeService,
  ) {}

  buildPhone(phone: Phone): string {
    return phone.countryNumber + phone.phoneNumber;
  }
  buildPhoneNumberView(phone: Phone): string {
    const number = phone.phoneNumber;
    return `+${phone.countryNumber} (${number[0]}) ${number.slice(1)}`
  }
  selectContact(contact: Contact): boolean {
    this.menuContactSelected = contact;
    return true;
  }
}
