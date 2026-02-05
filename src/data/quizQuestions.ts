import { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "birthDate",
    question: "When did your journey begin?",
    type: "datetime",
    options: [
      { value: "rat", label: "Rat (23h-1h)", description: "23:00 - 01:00" },
      { value: "ox", label: "Ox (1h-3h)", description: "01:00 - 03:00" },
      { value: "tiger", label: "Tiger (3h-5h)", description: "03:00 - 05:00" },
      { value: "rabbit", label: "Rabbit (5h-7h)", description: "05:00 - 07:00" },
      { value: "dragon", label: "Dragon (7h-9h)", description: "07:00 - 09:00" },
      { value: "snake", label: "Snake (9h-11h)", description: "09:00 - 11:00" },
      { value: "horse", label: "Horse (11h-13h)", description: "11:00 - 13:00" },
      { value: "goat", label: "Goat (13h-15h)", description: "13:00 - 15:00" },
      { value: "monkey", label: "Monkey (15h-17h)", description: "15:00 - 17:00" },
      { value: "rooster", label: "Rooster (17h-19h)", description: "17:00 - 19:00" },
      { value: "dog", label: "Dog (19h-21h)", description: "19:00 - 21:00" },
      { value: "pig", label: "Pig (21h-23h)", description: "21:00 - 23:00" },
      { value: "unknown", label: "I don't know", description: "That's okay" },
    ],
  },
  {
    id: "gender",
    question: "How do you identify?",
    type: "optional",
    options: [
      { value: "feminine", label: "Feminine Energy", description: "Yin-oriented patterns" },
      { value: "masculine", label: "Masculine Energy", description: "Yang-oriented patterns" },
      { value: "balanced", label: "Balanced", description: "Harmonized patterns" },
      { value: "prefer-not", label: "Prefer not to say", description: "We'll analyze universally" },
    ],
  },
  {
    id: "lifeFocus",
    question: "What area of life calls to you most right now?",
    type: "select",
    options: [
      { value: "career", label: "Career & Purpose", description: "Professional growth and meaningful work" },
      { value: "relationships", label: "Relationships", description: "Connections with loved ones" },
      { value: "personal", label: "Personal Growth", description: "Self-discovery and inner development" },
      { value: "balance", label: "Life Balance", description: "Harmony across all areas" },
    ],
  },
  {
    id: "currentAttention",
    question: "What draws your attention most in this moment?",
    type: "select",
    options: [
      { value: "stability", label: "Stability", description: "Building secure foundations" },
      { value: "change", label: "Change", description: "Embracing new directions" },
      { value: "growth", label: "Growth", description: "Expanding your horizons" },
      { value: "rest", label: "Rest", description: "Restoration and renewal" },
    ],
  },
  {
    id: "seekClarity",
    question: "Where do you seek clarity?",
    type: "select",
    options: [
      { value: "work", label: "Work & Career", description: "Professional path and decisions" },
      { value: "love", label: "Love & Connection", description: "Matters of the heart" },
      { value: "health", label: "Health & Vitality", description: "Physical and mental wellbeing" },
      { value: "purpose", label: "Life Purpose", description: "Meaning and direction" },
    ],
  },
];
