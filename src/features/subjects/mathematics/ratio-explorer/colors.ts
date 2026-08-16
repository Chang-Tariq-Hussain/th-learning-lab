export type ObjectColor = "blue" | "red";

export const OBJECT_COLORS: Record<ObjectColor, { hex: string; label: string }> = {
  blue: { hex: "#3D5AFE", label: "Blue" },
  red: { hex: "#E0524F", label: "Red" },
};

export const MAX_OBJECTS = 20;
