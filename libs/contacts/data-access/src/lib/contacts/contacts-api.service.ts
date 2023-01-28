import { Injectable } from '@angular/core';
import { Observable, of, switchMap, take } from 'rxjs';
import { Contact } from '@my-contacts/contacts/domain';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ContactsApiService {
  private readonly contactsKey = 'contacts';

  getContacts(): Observable<Contact[]> {
    return of(this.get<Contact[]>(this.contactsKey, []));
  }

  createContact(contact: Omit<Contact, 'id'>): Observable<Contact> {
    return this.getContacts().pipe(
      take(1),
      switchMap((contacts => {
        const createdContact = { ...contact, id: uuid() };
        this.set(this.contactsKey, [...contacts, createdContact]);
        return of(createdContact);
      }))
    );
  }

  updateContact(contact: Partial<Contact> & Pick<Contact, 'id'>): Observable<Contact> {
    return this.getContacts().pipe(
      take(1),
      switchMap((contacts => {
        const contactToUpdate = contacts.find(({ id }) => contact.id === id);
        if (!contactToUpdate) {
          throw new Error('404 Not found');
        }
        const updatedContact = { ...contactToUpdate, ...contact };
        this.set(this.contactsKey, contacts.map(c => c.id === contact.id ? updatedContact : c));
        return of(updatedContact);
      }))
    );
  }

  deleteContact(contact: Pick<Contact, 'id'>): Observable<Pick<Contact, 'id'>> {
    return this.getContacts().pipe(
      take(1),
      switchMap((contacts => {
        const contactToDelete = contacts.find(({ id }) => contact.id === id);
        if (!contactToDelete) {
          throw new Error('404 Not found');
        }
        this.set(this.contactsKey, contacts.filter(c => c.id !== contact.id));
        return of(contact);
      }))
    );
  }

  private get<T>(key: string, noItemValue: any): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : noItemValue;
  }

  private set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
