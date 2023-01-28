import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsHeaderComponent } from './contacts-header.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';

describe('ContactsHeaderComponent', () => {
  let component: ContactsHeaderComponent;
  let fixture: ComponentFixture<ContactsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectModule, SelectButtonModule, ButtonModule, ReactiveFormsModule],
      declarations: [ContactsHeaderComponent],
      providers: [DialogService]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
