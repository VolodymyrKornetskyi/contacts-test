import { actionsFactory, props } from '@ngneat/effects';
import { Contact } from '@my-contacts/contacts/domain';

const contactsActions = actionsFactory('Contacts');

export const getContacts = contactsActions.create('Get contacts');
export const createContact = contactsActions.create(
  'Create contact', props<{ contact: Omit<Contact, 'id'> }>()
);
export const updateContact = contactsActions.create(
  'Update contact', props<{ contact: Partial<Contact> & Pick<Contact, 'id'> }>()
);
export const deleteContact = contactsActions.create(
  'Delete contact', props<{ contact: Pick<Contact, 'id'> }>()
);
export const markContactAsFavorite = contactsActions.create(
  'Mark contact as favorite', props<{ contact: Pick<Contact, 'id'> }>()
);
export const removeContactFromFavorite = contactsActions.create(
  'Remove contact from favorite', props<{ contact: Pick<Contact, 'id'> }>()
);
