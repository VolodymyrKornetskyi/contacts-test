import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShowType } from '../contacts-layout/contacts-layout.component';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PositionsOptions } from '@my-contacts/contacts/domain';
import { ContactAddEditModalComponent } from '../contact-add-edit-modal/contact-add-edit-modal.component';
import { DialogService } from 'primeng/dynamicdialog';

@UntilDestroy()
@Component({
  selector: 'contacts-header',
  templateUrl: './contacts-header.component.html',
  styleUrls: ['./contacts-header.component.scss'],
})
export class ContactsHeaderComponent implements OnInit {
  positions = PositionsOptions;
  showTypeOptions = [
    { name: 'Contacts', code: ShowType.All },
    { name: 'Favorites', code: ShowType.Favorite },
  ];
  form = new FormGroup({
    city: new FormControl([], { nonNullable: true }),
    position: new FormControl([], { nonNullable: true }),
    showType: new FormControl(ShowType.All, { nonNullable: true }),
    search: new FormControl('', { nonNullable: true })
  });

  @Input() cities: { name: string, code: string }[] = []
  @Output() changeOptions = new EventEmitter<Partial<{
    showType: ShowType,
    search: string,
    city: string[],
    position: string[],
  }>>();

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(values => {
        this.changeOptions.emit(values)
    });
  }

  constructor(private readonly dialogService: DialogService) {}

  createContact(): void {
    this.dialogService.open(ContactAddEditModalComponent,
      {
        styleClass: 'add-edit-contact',
        showHeader: false,
      }
    );
  }
}
