import type { BookingService } from "../types/booking";
export const BUSINESS_HOURS = {
  start: "10:00",
  end: "18:00",
};

export const LUNCH_BREAK = {
  minimumMinutes: 30,
  flexible: true,
};

export const SERVICES: BookingService[] = [
  {
    id: "exterior-wash",
    name: "Exterior Wash",
    durationMinutes: 90,
  },
  {
    id: "premium-finish",
    name: "Premium Finish",
    durationMinutes: 150,
  },
];

export const DAILY_LIMITS = {
  maxSimple: 4,
  maxPremium: 3,
};