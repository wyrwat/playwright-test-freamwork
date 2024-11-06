import { RegisterUser } from '../models/user.model';
import { faker } from '@faker-js/faker/locale/en';

export default function randomUserData(): RegisterUser {
  const registerUserData: RegisterUser = {
    userFirtsName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
    userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
    userEmail: '',
    userPassword: faker.internet.password({ length: 8 }),
  };

  registerUserData.userEmail = faker.internet.email({
    firstName: registerUserData.userFirtsName,
    lastName: registerUserData.userLastName,
  });

  return registerUserData;
}
