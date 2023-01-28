import { Positions } from './position.model';

export interface Phone {
  countryNumber: string;
  phoneNumber: string;
}

export interface Contact {
  id: string;
  avatar: string;
  name: string;
  city: string;
  secondName: string;
  email: string;
  position: Positions;
  isFavorite: boolean;
  mainPhone?: Phone;
  additionalPhones?: Phone[];
}
