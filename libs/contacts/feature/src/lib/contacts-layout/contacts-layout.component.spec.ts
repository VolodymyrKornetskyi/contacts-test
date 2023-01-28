import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsLayoutComponent } from './contacts-layout.component';
import { ContactsFacadeService } from '@my-contacts/contacts/data-access';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ContactsListComponent } from '@my-contacts/contacts/feature';
import { DialogService } from 'primeng/dynamicdialog';

describe('ContactsLayoutComponent', () => {
  let component: ContactsLayoutComponent;
  let fixture: ComponentFixture<ContactsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressSpinnerModule],
      declarations: [ContactsLayoutComponent, ContactsListComponent],
      providers: [ContactsFacadeService, DialogService]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
