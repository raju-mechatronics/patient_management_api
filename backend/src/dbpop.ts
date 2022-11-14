import { faker } from '@faker-js/faker';
import { createPatient } from './patient/patient.service';

for (let i = 0; i < 10; i++) {
  const patient = {
    name: faker.name.fullName(),
    phone_number: faker.phone.number(),
    description: faker.lorem.words(100),
    created_at: faker.date.recent(365 * 3)
  };
  const extra = {
    address: faker.address.secondaryAddress(),
    email: faker.internet.email(),
    birth_date: faker.date.birthdate().toString()
  };

  console.log(patient, extra);
  createPatient(patient, extra);
}
