
import { Skinfolds, Gender } from '../types';

export const calculateBMI = (weight: number, height: number): number => {
  if (height <= 0 || weight <= 0) return 0;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(2));
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export const getDaysUntilExpiration = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

export const getAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const calculateBodyComposition = (
  weight: number,
  skinfolds: Skinfolds,
  age: number,
  gender: Gender
): { fatPercentage: number; fatMass: number; leanMass: number } => {
  const skinfoldsSum = Object.values(skinfolds).reduce((sum, value) => sum + (value || 0), 0);

  if (skinfoldsSum === 0 || age <= 0 || weight <= 0) {
    return { fatPercentage: 0, fatMass: 0, leanMass: 0 };
  }

  let bodyDensity = 0;

  // Pollock 7-Site Formula for Body Density
  if (gender === Gender.Male) {
    bodyDensity =
      1.112 -
      0.00043499 * skinfoldsSum +
      0.00000055 * skinfoldsSum * skinfoldsSum -
      0.00028826 * age;
  } else { // Gender.Female or Gender.Other (using female formula as a default)
    bodyDensity =
      1.097 -
      0.00046971 * skinfoldsSum +
      0.00000056 * skinfoldsSum * skinfoldsSum -
      0.00012828 * age;
  }
  
  if (bodyDensity <= 0) {
     return { fatPercentage: 0, fatMass: 0, leanMass: 0 };
  }

  // Siri Equation for Fat Percentage
  const fatPercentage = (495 / bodyDensity) - 450;
  
  if (fatPercentage < 0 || fatPercentage > 100) {
      return { fatPercentage: 0, fatMass: 0, leanMass: 0 };
  }

  const fatMass = weight * (fatPercentage / 100);
  const leanMass = weight - fatMass;

  return {
    fatPercentage: parseFloat(fatPercentage.toFixed(2)),
    fatMass: parseFloat(fatMass.toFixed(2)),
    leanMass: parseFloat(leanMass.toFixed(2)),
  };
};


export const getWeekDays = (startDate: Date): Date[] => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        days.push(day);
    }
    return days;
};

export const getWeekStartDate = (date = new Date()) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};
