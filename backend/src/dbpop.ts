import { faker } from '@faker-js/faker';
import { createPatient } from './patient/patient.service';
import {
  appointmentType,
  createAppointment
} from './appointment/appointment.service';

function populatePatient() {
  for (let i = 0; i < 10000; i++) {
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
    createPatient(patient, extra).then((e) => console.log(e));
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
      description: faker.lorem.words(350),
      phone_number: faker.phone.number(),
      Type_Name:
        appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      appointment_at: faker.date.recent(500)
    };
    // @ts-ignore
    const r = await createAppointment(appointment);
    console.log(r);
  }
}

populatePatient();
populateAppointment();
