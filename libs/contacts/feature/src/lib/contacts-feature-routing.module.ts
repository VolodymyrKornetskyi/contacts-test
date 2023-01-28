import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactsLayoutComponent } from './contacts-layout/contacts-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ContactsLayoutComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class ContactsFeatureRoutingModule {}
