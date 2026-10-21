const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateAIResponse = async (prompt) => {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      return response.text;

    } catch (error) {
      console.error(
        `Gemini AI attempt ${attempt} failed:`,
        error.message
      );

      if (attempt === maxAttempts) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 * attempt)
      );
    }
  }
};

module.exports = {
  generateAIResponse,
};