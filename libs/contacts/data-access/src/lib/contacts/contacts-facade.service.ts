import { Injectable } from '@angular/core';
import { Actions } from '@ngneat/effects-ng';
import { ContactsQuery } from './contacts.query';
import {
  createContact,
  deleteContact,
  getContacts,
  markContactAsFavorite,
  removeContactFromFavorite,
  updateContact
} from './contacts.actions';
import { Observable, take } from 'rxjs';
import { Contact } from '@my-contacts/contacts/domain';

@Injectable()
export class ContactsFacadeService {
  readonly allContacts$ = this.query.selectAll();
  readonly favouriteContacts$ = this.query.selectAll({
    filterBy: ({ isFavorite }) => isFavorite
  });

  constructor(
    private readonly actions: Actions,
    private readonly query: ContactsQuery,
  ) {
  }

  getContactById({ id }: Pick<Contact, 'id'>): Observable<Contact | undefined> {
    return this.query.selectEntity(id);
  }

  loadContacts(forceLoad = false): void {
    if (forceLoad) {
      this.actions.dispatch(getContacts());
    } else {
      this.query.select().pipe(
        take(1)
      ).subscribe(({ ids }) => {
        if (ids === undefined || ids.length === 0) {
          this.actions.dispatch(getContacts());
        }
      });
    }
  }

  createContact(contact: Omit<Contact, 'id'>): void {
    this.actions.dispatch(createContact({ contact }));
  }

  updateContact(contact: Partial<Contact> & Pick<Contact, 'id'>): void {
    this.actions.dispatch(updateContact({ contact }));
  }

  deleteContact(contact: Pick<Contact, 'id'>): void {
    this.actions.dispatch(deleteContact({ contact }));
  }

  markContactAsFavorite(contact: Pick<Contact, 'id'>): void {
    this.actions.dispatch(markContactAsFavorite({ contact }));
  }

  removeContactFromFavorite(contact: Pick<Contact, 'id'>): void {
    this.actions.dispatch(removeContactFromFavorite({ contact }));
  }
}
