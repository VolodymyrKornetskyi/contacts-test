import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { ContactsState } from './contacts.model';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'contacts' })
export class ContactsStore extends EntityStore<ContactsState> {
  constructor() {
    super();
  }
}
