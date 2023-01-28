import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () => import('@my-contacts/contacts/feature').then(module => module.ContactsFeatureModule),
      },
    ]),
  ],
})
export class ContactsShellModule {}
