import { EntityState } from '@datorama/akita';
import { Contact } from '@my-contacts/contacts/domain';

export interface ContactsState extends EntityState<Contact, string> {}
