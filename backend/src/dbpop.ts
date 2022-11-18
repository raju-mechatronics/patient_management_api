import { faker } from '@faker-js/faker';
import { createPatient } from './patient/patient.service';
import {
  appointmentType,
  createAppointment
} from './appointment/appointment.service';

async function populatePatient() {
  for (let i = 0; i < 10000; i++) {
    const patient = {
      name: faker.name.fullName(),
      phone_number: faker.phone.number(),
      description: faker.lorem.words(70),
      created_at: faker.date.recent(365 * 3)
    };
    const extra = {
      address: faker.address.secondaryAddress(),
      email: faker.internet.email(),
      birth_date: faker.date.birthdate().toString()
    };

    try {
      await createPatient(patient, extra);
    } catch (e) {
      console.log(e);
    }
  }
}

async function populateAppointment() {
  const appointmentTypes = [
    appointmentType.newReservations,
    appointmentType.patientsCheckup,
    appointmentType.surgeries
  ];
  for (let i = 0; i < 10000; i++) {
    const appointment = {
      name: faker.name.fullName(),
      description: faker.lorem.words(100),
      phone_number: faker.phone.number(),
      Type_Name:
        appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      appointment_at: faker.date.between(
        '2020-01-01T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z'
      ) //recent(500)
    };

    try {
      // @ts-ignore
      await createAppointment(appointment);
    } catch (e) {
      console.log(e);
    }
  }
}

populatePatient();
populateAppointment();
