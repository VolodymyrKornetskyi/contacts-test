import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { concatMap, map, switchMap } from 'rxjs';
import {
  createContact,
  deleteContact,
  getContacts,
  markContactAsFavorite,
  removeContactFromFavorite,
  updateContact
} from './contacts.actions';
import { ContactsApiService } from './contacts-api.service';
import { ContactsStore } from './contacts.store';

@Injectable({
  providedIn: 'root',
})
export class ContactsEffects {
  constructor(
    private readonly store: ContactsStore,
    private readonly api: ContactsApiService,
  ) {}

  getContacts$$ = createEffect(actions => actions.pipe(
    ofType(getContacts),
    switchMap(() => this.api.getContacts()),
    map(contacts => this.store.set(contacts))
  ));

  createContact$$ = createEffect(actions => actions.pipe(
    ofType(createContact),
    concatMap(({ contact }) => this.api.createContact(contact)),
    map(contact => this.store.add(contact))
  ));

  updateContact$$ = createEffect(actions => actions.pipe(
    ofType(updateContact),
    concatMap(({ contact }) => this.api.updateContact(contact)),
    map(contact => this.store.update(contact.id, contact))
  ));

  deleteContact$$ = createEffect(actions => actions.pipe(
    ofType(deleteContact),
    concatMap(({ contact }) => this.api.deleteContact(contact)),
    map(contact => this.store.remove(contact.id))
  ));

  markContactAsFavorite$$ = createEffect(actions => actions.pipe(
    ofType(markContactAsFavorite),
    concatMap(({ contact: { id } }) => this.api.updateContact({
      ...this.store.getValue().entities?.[id],
      id,
      isFavorite: true
    })),
    map(contact => this.store.update(contact.id, contact))
  ));

  removeContactFromFavorite$$ = createEffect(actions => actions.pipe(
    ofType(removeContactFromFavorite),
    concatMap(({ contact: { id } }) => this.api.updateContact({
      ...this.store.getValue().entities?.[id],
      id,
      isFavorite: false
    })),
    map(contact => this.store.update(contact.id, contact))
  ));
}
