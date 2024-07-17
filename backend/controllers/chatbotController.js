import natural from "natural";
import { questions } from "../data/chatbotQuestions.js";

const tokenizer = new natural.WordTokenizer();

export const chatbot = async (req, res) => {
  const userQuestion = req.body.question;
  const tokens = tokenizer.tokenize(userQuestion.toLowerCase());
  let bestMatch = { question: "", answer: "", score: 0 };

  questions.forEach(({ q, a }) => {
    const qTokens = tokenizer.tokenize(q.toLowerCase());
    const score = natural.JaroWinklerDistance(
      tokens.join(" "),
      qTokens.join(" ")
    );
    if (score > bestMatch.score) {
      bestMatch = { question: q, answer: a, score };
    }
  });

  if (bestMatch.score > 0.7) {
    // Threshold for similarity
    res.json({ answer: bestMatch.answer });
  } else {
    res.json({
      answer:
        "I'm not sure how to answer that. Please contact customer support for assistance.",
    });
  }
};
