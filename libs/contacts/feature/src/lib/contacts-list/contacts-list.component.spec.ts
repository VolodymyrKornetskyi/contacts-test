import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsListComponent } from './contacts-list.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ContactsFacadeService } from '@my-contacts/contacts/data-access';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

describe('ContactsListComponent', () => {
  let component: ContactsListComponent;
  let fixture: ComponentFixture<ContactsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableModule, MenuModule, ProgressSpinnerModule],
      declarations: [ContactsListComponent],
      providers: [DialogService, ContactsFacadeService]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
