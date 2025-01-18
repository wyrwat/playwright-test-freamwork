import { RegisterUserModel } from '@_src/ui/models/user.model';
import { faker } from '@faker-js/faker/locale/en';

export default function createRandomUserData(): RegisterUserModel {
  const registerUserData: RegisterUserModel = {
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

export class UserFactory {
  randomUser(): RegisterUserModel {
    const registerUserData: RegisterUserModel = {
      userFirtsName: faker.person.firstName(),
      userLastName: faker.person.lastName(),
      userEmail: '',
      userPassword: faker.internet.password(),
    };

    registerUserData.userEmail = faker.internet.email({
      firstName: registerUserData.userFirtsName,
      lastName: registerUserData.userLastName,
    });
    return registerUserData;
  }
}
