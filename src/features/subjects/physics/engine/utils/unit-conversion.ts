/**
 * The engine's internal units are always SI (meters, kilograms, seconds,
 * radians) — every formula in `forces/`, `collision/`, and `core/`
 * assumes this. These converters exist purely for *display*, so a
 * simulation can show a mass in grams or an angle in degrees without
 * the engine itself ever working in anything but SI.
 */

export const metersToFeet = (m: number): number => m * 3.28084;
export const feetToMeters = (ft: number): number => ft / 3.28084;

export const metersToCentimeters = (m: number): number => m * 100;
export const centimetersToMeters = (cm: number): number => cm / 100;

export const kilogramsToGrams = (kg: number): number => kg * 1000;
export const gramsToKilograms = (g: number): number => g / 1000;

export const kilogramsToPounds = (kg: number): number => kg * 2.20462;
export const poundsToKilograms = (lb: number): number => lb / 2.20462;

export const radiansToDegrees = (rad: number): number => (rad * 180) / Math.PI;
export const degreesToRadians = (deg: number): number => (deg * Math.PI) / 180;

export const metersPerSecondToKmh = (mps: number): number => mps * 3.6;
export const kmhToMetersPerSecond = (kmh: number): number => kmh / 3.6;

export const joulesToCalories = (j: number): number => j / 4.184;
export const caloriesToJoules = (cal: number): number => cal * 4.184;
