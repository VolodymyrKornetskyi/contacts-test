import { NgModule } from '@angular/core';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { ContactsEffects } from './contacts.effect';
import { ContactsApiService } from './contacts-api.service';
import { ContactsFacadeService } from './contacts-facade.service';

@NgModule({
  imports: [EffectsNgModule.forFeature([ContactsEffects])],
  providers: [
    ContactsApiService,
    ContactsFacadeService,
  ],
})
export class ContactsDataAccessModule {}
