import { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "birthDate",
    question: "When did your journey begin?",
    type: "date",
  },
  {
    id: "birthTime",
    question: "What time were you born?",
    type: "time",
    options: [
      { value: "morning", label: "Morning", description: "6:00 AM - 12:00 PM" },
      { value: "afternoon", label: "Afternoon", description: "12:00 PM - 6:00 PM" },
      { value: "evening", label: "Evening", description: "6:00 PM - 12:00 AM" },
      { value: "night", label: "Night", description: "12:00 AM - 6:00 AM" },
      { value: "unknown", label: "I'm not sure", description: "That's okay, we'll work with what we have" },
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
