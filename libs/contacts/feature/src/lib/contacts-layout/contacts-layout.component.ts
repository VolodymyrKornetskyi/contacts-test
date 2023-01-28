import { Component } from '@angular/core';
import { ContactsFacadeService } from '@my-contacts/contacts/data-access';
import { BehaviorSubject, combineLatest, map, Observable, ReplaySubject, tap } from 'rxjs';
import { Contact } from '@my-contacts/contacts/domain';

export const enum ShowType {
  All = 'all',
  Favorite = 'favorite'
}

const searchFields: (keyof Contact)[]= ['name', 'email', 'secondName'];

@Component({
  selector: 'contacts-layout',
  templateUrl: './contacts-layout.component.html',
  styleUrls: ['./contacts-layout.component.scss'],
})
export class ContactsLayoutComponent {
  contactsFilters$ = new BehaviorSubject<Partial<{
    showType: ShowType,
    search: string,
    city: string[],
    position: string[]
  }>>({
    showType: ShowType.All,
    search: '',
    city: [],
    position: []
  });
  cities$ = new ReplaySubject<{ name: string, code: string }[]>(1);
  contactsToShow$: Observable<Contact[]>;
  vm$: Observable<{ allContacts: Contact[], favoriteContacts: Contact[] }>

  constructor(private readonly contactsFacadeService: ContactsFacadeService) {
    this.vm$ = combineLatest([
      this.contactsFacadeService.allContacts$.pipe(
        tap(contacts => this.cities$.next(
          Array.from(
            new Set(
              contacts.map(c => c.city).filter(c => c != null)
            )
          ).map(city => ({ code: city, name: city }))
        ))
      ),
      this.contactsFacadeService.favouriteContacts$,
    ]).pipe(map(([allContacts, favoriteContacts]) => ({ allContacts, favoriteContacts })))

    this.contactsToShow$ = combineLatest([
      this.vm$,
      this.contactsFilters$,
    ]).pipe(
      map(([{ allContacts, favoriteContacts }, filters]) =>
        (filters.showType === ShowType.Favorite ? favoriteContacts : allContacts).filter(
          contact => {
            let shouldReturn = true;
            if (filters.city?.length) {
              shouldReturn = filters.city.includes(contact.city);
            }
            if (shouldReturn && filters.position?.length) {
              shouldReturn = filters.position.includes(contact.position);
            }
            if (shouldReturn && filters.search) {
              shouldReturn = searchFields.some(
                field => (contact[field] as string)?.toLowerCase()?.includes(filters.search ?? '')
              );
            }

            return shouldReturn;
          }
        )
      ),
    )

    this.contactsFacadeService.loadContacts();
  }

  changeOptions(options: Partial<{
    showType: ShowType,
    search: string,
    city: string[],
    position: string[],
  }>): void {
    this.contactsFilters$.next(options);
  }
}
