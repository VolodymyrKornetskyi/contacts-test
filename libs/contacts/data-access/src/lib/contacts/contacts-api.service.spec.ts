import { ContactsApiService } from './contacts-api.service';
import { catchError, of, take } from 'rxjs';
import { validate as uuidValidate } from 'uuid';

describe('Contacts api service', () => {
  let service: ContactsApiService;

  beforeEach(() => {
    service = new ContactsApiService();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get contacts as empty array from local storage if they do not exist', done => {
    service.getContacts().pipe(take(1)).subscribe(contacts => {
      expect(contacts).toEqual([]);
      done();
    });
  });

  it('should get contacts array from local storage', done => {
    const contactMock = { id: 'id1' };
    localStorage.setItem('contacts', JSON.stringify([contactMock]));
    service.getContacts().pipe(take(1)).subscribe(contacts => {
      expect(contacts).toEqual([contactMock]);
      done();
    });
  });

  it('should add contact to array in local storage', done => {
    const contactMock = { id: 'id1', name: 'name1' };
    const contactMockToAdd = { name: 'name2' };
    localStorage.setItem('contacts', JSON.stringify([contactMock]));
    service.createContact(contactMockToAdd as any)
      .pipe(take(1))
      .subscribe(contact => {
        expect(contact.name).toEqual(contactMockToAdd.name);
        expect(uuidValidate(contact.id)).toBeTruthy();
        expect(JSON.parse(localStorage.getItem('contacts') ?? '')?.length).toEqual(2);
        done();
    });
  });

  it('should update contact in array in local storage', done => {
    const contactsMock = [{ id: 'id1', name: 'name1' }, { id: 'id2', name: 'name2' }, { id: 'id3', name: 'name3' }];
    const contactMockToUpdate = { id: 'id1', name: 'name2' };
    localStorage.setItem('contacts', JSON.stringify(contactsMock));
    service.updateContact(contactMockToUpdate)
      .pipe(take(1))
      .subscribe(contact => {
        expect(contact.name).toEqual(contactMockToUpdate.name);
        expect(JSON.parse(localStorage.getItem('contacts') ?? '')[0]).toEqual(contactMockToUpdate);
        done();
    });
  });

  it('should throw error during contact update if contact is not in array in local storage', done => {
    const contactMock = { id: 'id2', name: 'name1' };
    const contactMockToUpdate = { id: 'id1', name: 'name2' };
    localStorage.setItem('contacts', JSON.stringify([contactMock]));
    service.updateContact(contactMockToUpdate)
      .pipe(
        take(1),
        catchError(error => {
          expect(error.message).toEqual('404 Not found');
          done();
          return of(error)
        })
      )
      .subscribe();
  });

  it('should delete contact from array in local storage', done => {
    const contactMock = { id: 'id1', name: 'name1' };
    const contactMockToDelete = { id: 'id1' };
    localStorage.setItem('contacts', JSON.stringify([contactMock]));
    service.deleteContact(contactMockToDelete)
      .pipe(take(1))
      .subscribe(contact => {
        expect(contact.id).toEqual(contactMockToDelete.id);
        expect(JSON.parse(localStorage.getItem('contacts') ?? '')).toEqual([]);
        done();
    });
  });

  it('should throw error during contact delete if contact is not in array in local storage', done => {
    const contactMock = { id: 'id2', name: 'name1' };
    const contactMockToDelete = { id: 'id1' };
    localStorage.setItem('contacts', JSON.stringify([contactMock]));
    service.deleteContact(contactMockToDelete)
      .pipe(
        take(1),
        catchError(error => {
          expect(error.message).toEqual('404 Not found');
          done();
          return of(error)
        })
      )
      .subscribe();
  });
});
