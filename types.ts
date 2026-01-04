
export enum Gender {
  Female = 'Feminino',
  Male = 'Masculino',
  Other = 'Outro',
}

export interface BodyMeasurements {
  // Tronco
  pescoco: number;
  ombro: number;
  torax: number;
  cintura: number;
  abdomen: number;
  quadril: number;

  // Membros Superiores
  bracoRelaxadoDireito: number;
  bracoRelaxadoEsquerdo: number;
  bracoContraidoDireito: number;
  bracoContraidoEsquerdo: number;
  antebracoDireito: number;
  antebracoEsquerdo: number;

  // Membros Inferiores
  coxaProximalDireita: number;
  coxaProximalEsquerda: number;
  coxaMedialDireita: number;
  coxaMedialEsquerda: number;
  coxaDistalDireita: number;
  coxaDistalEsquerda: number;
  panturrilhaDireita: number;
  panturrilhaEsquerda: number;
}

export interface Skinfolds {
  subescapular: number;
  tricipital: number;
  peitoral: number;
  axilarMedia: number;
  supraIliaca: number;
  abdominal: number;
  coxa: number;
}

export interface PhysicalAssessment {
  id: string;
  date: string;
  weight: number;
  height: number;
  
  // Calculated
  bmi: number;
  fatPercentage: number;
  fatMass: number;
  leanMass: number;

  bodyMeasurements: BodyMeasurements;
  skinfolds: Skinfolds;
}

export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  load: string;
  interval: string;
  advancedTechnique: string;
}

export interface WorkoutDay {
  id: string;
  name: string; // e.g., 'Treino A'
  musclesWorked: string;
  observations: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  startDate: string;
  endDate: string;
  trainingDaysPerWeek: number;
  workouts: WorkoutDay[];
}

export interface AttendanceDay {
  date: string;
  trained: boolean;
}

export interface AttendanceWeek {
  id: string;
  weekStartDate: string;
  days: AttendanceDay[];
  daysTrained: number;
  frequencyPercentage: number;
}

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  gender: Gender;
  startDate: string;
  observations: string;
  assessments: PhysicalAssessment[];
  workoutPlans: WorkoutPlan[];
  attendance: AttendanceWeek[];
}
