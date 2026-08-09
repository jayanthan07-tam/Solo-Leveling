import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { LifeTimeDetails } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique Solo Leveling Player ID (e.g. SOLO-7K4P9Q)
export function generatePlayerId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'SOLO-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// XP required for next level formula: requiredXP = round(100 * 1.25^level)
export function getRequiredXpForLevel(level: number): number {
  if (level <= 0) return 100;
  return Math.round(100 * Math.pow(1.5, level));
}

// Calculate exact age in years from DOB
export function calculateAge(dobString: string): number {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

// Calculate high-precision exact Life Time Alive (Years, Months, Days, Hours, Minutes, Seconds)
export function calculateLifeTime(dobString: string): LifeTimeDetails {
  if (!dobString) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedString: '0Y 0M 0D 00:00:00',
    };
  }

  const birthDate = new Date(dobString);
  const now = new Date();

  if (isNaN(birthDate.getTime()) || birthDate > now) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedString: 'SYSTEM INITIALIZING...',
    };
  }

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const totalSeconds = Math.floor((now.getTime() - birthDate.getTime()) / 1000);

  const pad = (num: number) => num.toString().padStart(2, '0');
  const formattedString = `${years} YEARS, ${months} MONTHS, ${days} DAYS | ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    formattedString,
  };
}

// Format numbers with commas (e.g. 1,250 G)
export function formatCoins(amount: number): string {
  return amount.toLocaleString('en-US') + ' G';
}
