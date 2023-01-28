import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ContactsStore } from './contacts.store';
import { ContactsState } from './contacts.model';

@Injectable({ providedIn: 'root' })
export class ContactsQuery extends QueryEntity<ContactsState> {
  constructor(protected override store: ContactsStore) {
    super(store);
  }
}
