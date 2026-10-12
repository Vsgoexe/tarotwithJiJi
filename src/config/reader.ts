export interface ReaderProfile {
  headline: string;
  paragraphs: string[];
  closingScriptLine: string;
  closingLine: string;
  credentials: string[];
}

export const readerProfile: ReaderProfile = {
  headline: "About Me | Tarot Reader & Astrologer",
  paragraphs: [
    "With 7 years of experience studying astrology and tarot, I have spent years exploring the connection between intuition, energy, and the deeper patterns that shape our lives. What began as a personal passion has grown into a calling, allowing me to help others find clarity, perspective, and guidance through the cards.",
    "As a professional tarot reader with 2 years of hands-on reading experience, I have conducted thousands of readings and connected with countless individuals seeking answers about love, relationships, career, personal growth, and their spiritual journeys. Every reading is approached with care, intuition, and an open mind, creating a safe space for you to explore your questions without fear of judgment.",
    "My intention is not simply to interpret the cards, but to help you understand the energies surrounding your situation, recognise patterns, explore possibilities, and reconnect with your own inner wisdom. Whether you’re navigating uncertainty in love, seeking direction in your career, or simply looking for a deeper understanding of yourself, each reading is tailored to your unique questions and circumstances.",
    "With many happy clients and meaningful connections built through my readings, I believe tarot is more than just predicting possibilities—it’s about finding clarity in confusion, understanding the present, and approaching the future with greater confidence.",
  ],
  closingScriptLine: "Your journey, your questions, your cards.",
  closingLine: "Let’s uncover the messages waiting to be explored.",
  credentials: [
    "7 years studying astrology & tarot",
    "2 years professional readings",
  ],
};
