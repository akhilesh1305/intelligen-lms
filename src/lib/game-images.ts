/** Game hub & card imagery (Unsplash — allowed in next.config). */

export const GAMES_PAGE_IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&h=600&fit=crop&q=80",
  corporateSection:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop&q=80",
  quizSection:
    "https://images.unsplash.com/photo-1606326603696-aa5b3f33d4e5?w=1200&h=400&fit=crop&q=80",
  knowledgeSection:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=400&fit=crop&q=80",
} as const;

export { HOME_CORPORATE_GAME_IMAGES, HOME_MIND_GAME_IMAGES } from "@/lib/home-images";

export const KNOWLEDGE_GAME_IMAGES: Record<string, string> = {
  "flashcard-challenge":
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=360&fit=crop&q=80",
  "match-the-pair":
    "https://images.unsplash.com/photo-1526778548025-fa2faacd0524?w=600&h=360&fit=crop&q=80",
  "memory-game":
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=360&fit=crop&q=80",
  "word-scramble":
    "https://images.unsplash.com/photo-1456513080850-041fb94929bb?w=600&h=360&fit=crop&q=80",
  "crossword-puzzle":
    "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5a?w=600&h=360&fit=crop&q=80",
};
