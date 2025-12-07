/**
 * Disaster Scenarios for Disaster Reflex Trainer
 * Each scenario has a correct answer and incorrect options
 */

export interface DisasterOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface DisasterScenario {
  id: string;
  name: string;
  description: string;
  options: DisasterOption[];
  icon: string;
}

export const DISASTER_SCENARIOS: DisasterScenario[] = [
  {
    id: "earthquake",
    name: "Earthquake",
    description: "The ground starts shaking violently!",
    icon: "🌍",
    options: [
      {
        id: "table",
        text: "Go under a table",
        isCorrect: true,
      },
      {
        id: "elevator",
        text: "Run to elevator",
        isCorrect: false,
      },
    ],
  },
  {
    id: "fire",
    name: "Fire",
    description: "Smoke and flames are spreading!",
    icon: "🔥",
    options: [
      {
        id: "stairs",
        text: "Use stairs and go out",
        isCorrect: true,
      },
      {
        id: "lift",
        text: "Use lift",
        isCorrect: false,
      },
      {
        id: "window",
        text: "Open window",
        isCorrect: false,
      },
    ],
  },
  {
    id: "flood",
    name: "Flood",
    description: "Water is rising rapidly!",
    icon: "🌊",
    options: [
      {
        id: "higher-ground",
        text: "Go to higher ground",
        isCorrect: true,
      },
      {
        id: "walk-through",
        text: "Walk through water",
        isCorrect: false,
      },
    ],
  },
  {
    id: "gas-leak",
    name: "Gas Leak",
    description: "You smell gas in the building!",
    icon: "💨",
    options: [
      {
        id: "outside",
        text: "Open windows and go outside",
        isCorrect: true,
      },
      {
        id: "lights",
        text: "Switch on lights",
        isCorrect: false,
      },
      {
        id: "match",
        text: "Use matchstick",
        isCorrect: false,
      },
    ],
  },
  {
    id: "lightning",
    name: "Lightning",
    description: "Severe lightning storm outside!",
    icon: "⚡",
    options: [
      {
        id: "inside",
        text: "Stay inside",
        isCorrect: true,
      },
      {
        id: "tree",
        text: "Stand under tree",
        isCorrect: false,
      },
    ],
  },
];

/**
 * Get a random disaster scenario
 */
export function getRandomScenario(): DisasterScenario {
  const randomIndex = Math.floor(Math.random() * DISASTER_SCENARIOS.length);
  return DISASTER_SCENARIOS[randomIndex];
}

/**
 * Get scenario by ID
 */
export function getScenarioById(id: string): DisasterScenario | undefined {
  return DISASTER_SCENARIOS.find((scenario) => scenario.id === id);
}

