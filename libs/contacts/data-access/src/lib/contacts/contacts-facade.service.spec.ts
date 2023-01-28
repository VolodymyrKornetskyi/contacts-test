import { ContactsFacadeService } from '@my-contacts/contacts/data-access';
import { TestBed } from '@angular/core/testing';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import {
  createContact,
  deleteContact,
  getContacts,
  markContactAsFavorite,
  removeContactFromFavorite,
  updateContact
} from './contacts.actions';
import { ContactsStore } from './contacts.store';
import { Contact } from '@my-contacts/contacts/domain';
import { Observable, of, take } from 'rxjs';
import { ContactsEffects } from './contacts.effect';
import { ContactsApiService } from './contacts-api.service';
import { v4 as uuid } from 'uuid';

const apiServiceMock = {
  getContacts: (): Observable<Contact[]> => {
    return of([]);
  },
  createContact: (contact: Omit<Contact, 'id'>): Observable<Contact> => {
    return of({
      ...contact,
      id: uuid()
    });
  },
  updateContact: (contact: Partial<Contact> & Pick<Contact, 'id'>): Observable<Contact> => {
    return of({
      ...contact
    } as Contact);
  },
  deleteContact: (contact: Pick<Contact, 'id'>): Observable<Pick<Contact, 'id'>> => {
    return of(contact);
  },
}

describe('Contacts facade service', () => {
  let service: ContactsFacadeService;
  let actions: Actions;
  let store: ContactsStore;
  let effects: ContactsEffects;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        EffectsNgModule.forRoot([ContactsEffects])
      ],
      providers: [
        ContactsFacadeService,
        {
          provide: ContactsApiService,
          useValue: apiServiceMock
        },
      ]
    });

    actions = TestBed.inject(Actions);
    store = TestBed.inject(ContactsStore);
    effects = TestBed.inject(ContactsEffects);
    service = TestBed.inject(ContactsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch create contact', () => {
    const actionsSpy = jest.spyOn(actions, 'dispatch');
    const contactMock = { name: 'name1' } as Omit<Contact, 'id'>;
    service.createContact(contactMock);
    expect(actionsSpy).toHaveBeenCalledWith(createContact({ contact: contactMock }));
    expect(store.getValue().ids?.length).toEqual(1);
  });

  it('should dispatch update contact', () => {
    const actionsSpy = jest.spyOn(actions, 'dispatch');
    const contactMock = { id: 'id1', name: 'name1' };
    store.add({ id: 'id1', name: 'name2' } as any);
    service.updateContact(contactMock);
    expect(actionsSpy).toHaveBeenCalledWith(updateContact({ contact: contactMock }));
    expect(store.getValue().entities?.['id1']?.name).toEqual(contactMock.name);
  });

  it('should dispatch delete contact', () => {
    const actionsSpy = jest.spyOn(actions, 'dispatch');
    store.add({ id: 'id1', name: 'name2' } as any);
    service.deleteContact({ id: 'id1' });
    expect(actionsSpy).toHaveBeenCalledWith(deleteContact({ contact: { id: 'id1' } }));
    expect(store.getValue().ids?.length).toEqual(0);
  });

  it('should mark contact as favorite', () => {
    const actionsSpy = jest.spyOn(actions, 'dispatch');
    store.add({ id: 'id1', name: 'name2', isFavorite: false } as any);
    service.markContactAsFavorite({ id: 'id1' });
    expect(actionsSpy).toHaveBeenCalledWith(markContactAsFavorite({ contact: { id: 'id1' } }));
    expect(store.getValue().entities?.['id1']?.isFavorite).toBeTruthy();
  });

  it('should mark contact as favorite even if it not exist in store', () => {
    const apiUpdateMock = jest.spyOn(apiServiceMock, 'updateContact');
    const actionsSpy = jest.spyOn(actions, 'dispatch');
    store.update(state => ({
      ...state,
      entities: undefined
    }));
    service.markContactAsFavorite({ id: 'id1' });
    expect(actionsSpy).toHaveBeenCalledWith(markContactAsFavorite({ contact: { id: 'id1' } }));
    expect(apiUpdateMock).toHaveBeenCalledWith({ id: 'id1', isFavorite: true });
  });

  it('should remove contact from favorite', () => {
    const actionsSpy = jest.spyOn(actions, 'dispatch');
    store.add({ id: 'id1', name: 'name2', isFavorite: true } as any);
    service.removeContactFromFavorite({ id: 'id1' });
    expect(actionsSpy).toHaveBeenCalledWith(removeContactFromFavorite({ contact: { id: 'id1' } }));
    expect(store.getValue().entities?.['id1']?.isFavorite).toBeFalsy();
  });

  it('should dispatch get contacts if no contacts in store', () => {
    const actionsSpy = jest.spyOn(actions, 'dispatch');

    store.update(state => ({
      ...state,
      ids: undefined
    }));

    service.loadContacts();
    expect(actionsSpy).toHaveBeenCalledWith(getContacts());
    store.update(state => ({
      ...state,
      ids: []
    }));

    service.loadContacts();
    expect(actionsSpy).toHaveBeenCalledWith(getContacts());
  });

  it('should not dispatch get contacts if contacts are in the store', () => {
    const actionsSpy = jest.spyOn(actions, 'dispatch').mockReset();

    store.update(state => ({
      ...state,
      ids: ['id1']
    }))
    service.loadContacts();
    expect(actionsSpy).not.toHaveBeenCalledWith(getContacts())
  });

  it('should dispatch get contacts if force fetch provided and contacts are in the store', () => {
    const actionsSpy = jest.spyOn(actions, 'dispatch');

    store.update(state => ({
      ...state,
      ids: ['id1']
    }))
    service.loadContacts(true);
    expect(actionsSpy).toHaveBeenCalledWith(getContacts())
  });

  it('should get contact by id', done => {
    store.update(state => ({
      ...state,
      ids: ['id1'],
      entities: {
        'id1': { id: 'id1' } as Contact
      }
    }))
    service.getContactById({ id: 'id1' })
      .pipe(take(1))
      .subscribe(contact => {
        expect(contact?.id).toEqual('id1');
        done();
      });
  });

  it('should not get contact by id if it does not exist in store', done => {
    service.getContactById({ id: 'id1' })
      .pipe(take(1))
      .subscribe(contact => {
        expect(contact).toBeUndefined();
        done();
      });
  });

  it('should fetch favorite contacts', done => {
    const favContactMock = { id: 'id1', isFavorite: true };
    const notFavContactMock = { id: 'id2', isFavorite: false };
    store.add(favContactMock as Contact);
    store.add(notFavContactMock as Contact);

    service.favouriteContacts$
      .pipe(take(1))
      .subscribe(contacts => {
        expect(contacts.length).toEqual(1);
        expect(contacts[0]).toEqual(favContactMock);
        done();
      });
  });
});
