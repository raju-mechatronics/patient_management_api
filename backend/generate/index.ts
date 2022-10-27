// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT

export interface Patient {
  id: number;
  name: string;
  phone_number: string;
  date: Date;
  description: string;
  Extra_Info: Extra_Info[];
  Payment: Payment[];
}

export interface Extra_Info_Col {
  id: number;
  name: string;
  Extra_Info: Extra_Info[];
}

export interface Extra_Info {
  id: number;
  value: string;
  column: Extra_Info_Col;
  patient: Patient;
  extra_Info_ColId: number;
  patientId: number;
}

export interface Payment {
  id: number;
  date: Date;
  amount: number;
  patientId: number;
  Patient: Patient;
}

export interface Appointment_Type {
  id: number;
  name: string;
  Appointment: Appointment[];
}

export interface Appointment {
  id: number;
  type: Appointment_Type;
  Type_Name: string;
  name: string;
  phone_number: string;
  description: string;
  appointment_at: Date;
}
