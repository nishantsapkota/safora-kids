export const MODULES = [
  { key: "traffic_road_safety", label: "Traffic Safety", color: "#2563eb" },
  { key: "natural_disaster_preparedness", label: "Disaster Prep", color: "#1f9d55" },
  { key: "household_occupational_hazards", label: "Home Hazards", color: "#f97316" },
  { key: "basic_first_aid", label: "First Aid", color: "#dc2626" },
  { key: "good_habits_hygiene", label: "Health Hygiene", color: "#7c3aed" }
] as const;

export const AI_POOL_MODULE = "ai_adaptive_pool";

export const MODULE_LABELS = Object.fromEntries(MODULES.map((module) => [module.key, module.label]));

export const DEFAULT_OFF_DAYS = [1, 2];

export const BADGES = [
  { name: "Road Safety Star", module: "traffic_road_safety" },
  { name: "Disaster Ready Hero", module: "natural_disaster_preparedness" },
  { name: "Home Safety Helper", module: "household_occupational_hazards" },
  { name: "First Aid Learner", module: "basic_first_aid" },
  { name: "Hygiene Champion", module: "good_habits_hygiene" },
  { name: "Safora Safety Champion", module: "overall" }
];

export const AGE_GROUPS = ["6-8", "9-11", "12-14"] as const;

export const DAY_PATTERN_A = {
  traffic_road_safety: 5,
  natural_disaster_preparedness: 5,
  household_occupational_hazards: 5,
  basic_first_aid: 5,
  good_habits_hygiene: 3,
  ai_selected: 2
};

export const DAY_PATTERN_B = {
  traffic_road_safety: 5,
  natural_disaster_preparedness: 5,
  household_occupational_hazards: 5,
  basic_first_aid: 5,
  good_habits_hygiene: 2,
  ai_selected: 3
};
