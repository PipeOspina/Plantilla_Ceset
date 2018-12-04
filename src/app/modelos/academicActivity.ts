import { User, createNewUser, NAMES as NOMBRES } from './user';
import { Contract, createNewContract } from './contract';

export interface AcademicActivity {
    id: number;
    user: User;
    name: string;
    type: string;
    dependency: string;
    investigationGroup?: string;
    coordinatorName: string;
    coordinatorPhone: number;
    coordinatorEmail: string;
    duration: number;
    contract?: Contract;
    creationDate: Date;
    state: string;
}

export function createNewActivity(id: number, name?: string): AcademicActivity {
    const auxName = name || NAMES[Math.round(Math.random() * (NAMES.length - 1))];
    const user: User = createNewUser(id);
    const type = TYPES[Math.round(Math.random() * (TYPES.length - 1))];
    const dependency = 'Other';
    const coordinatorName = NOMBRES[Math.round(Math.random() * (NOMBRES.length - 1))];
    const coordinatorEmail = coordinatorName.toLowerCase() + '.' + TYPES[Math.round(Math.random() * (TYPES.length - 1))].toLocaleLowerCase() + '@' + auxName.toLocaleLowerCase() + '.com';
    const coordinatorPhone = Math.round(Math.random() * (10000000 - 1));
    const duration = Math.round(Math.random() * (13 - 1));
    const contract = Math.round(Math.random() * (2 - 1)) == 0 ? createNewContract() : null;
    const creationDate = new Date();
    const state = 'Activo';

  return {
    id: id,
    name: auxName,
    user: user,
    type: type,
    dependency: dependency,
    coordinatorName: coordinatorName,
    coordinatorEmail: coordinatorEmail,
    coordinatorPhone: coordinatorPhone,
    duration: duration,
    contract: contract,
    creationDate: creationDate,
    state: state
  };
}

export const NAMES = [
    'Bailando con Robots',
    'Jugando a Programar',
    'Marketing de Coquito',
    'Nacho Algoritmea',
    'Perdiendo el control con SQL',
    'Como depilarse las Cejas',
    'Cortando cabello con Norberto',
    'Como armar mi primera cama',
    'Tirandose a la jura',
    'Aprendiendo a ser Dios'
]

export const TYPES = [
    'Consultoría Profesional',
    'Servicio Técnico de Laboratorio',
    'Educación no Formal',
    'Gestión Tecnológica'
]