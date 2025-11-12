
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { MenuItem } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume the key is set in the environment.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const menuSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      category: { 
        type: Type.STRING, 
        description: "Kategorija jela. Mora biti jedna od: 'Predjela', 'Glavna jela', 'Deserti', 'Pića'." 
      },
      name: { 
        type: Type.STRING, 
        description: "Naziv jela." 
      },
      description: { 
        type: Type.STRING, 
        description: "Kratak, primamljiv opis jela." 
      },
      price: { 
        type: Type.NUMBER, 
        description: "Cijena jela." 
      },
      currency: { 
        type: Type.STRING, 
        description: "Valuta, 'kn' ili '€'." 
      },
      isVegetarian: { 
        type: Type.BOOLEAN, 
        description: "Istina ako je jelo vegetarijansko." 
      },
      allergens: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Popis potencijalnih alergena."
      }
    },
    required: ["category", "name", "price", "currency", "description"]
  }
};

export const extractMenuFromImage = async (base64Image: string, mimeType: string): Promise<Omit<MenuItem, 'id'>[]> => {
  try {
    const imagePart = { inlineData: { data: base64Image, mimeType } };
    const textPart = { text: "Prepoznaj sve stavke s jelovnika na ovoj slici. Precizno slijedi zadanu JSON shemu. Analiziraj jelovnik na hrvatskom jeziku. Napiši opise na hrvatskom." };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: menuSchema,
      },
    });

    const jsonText = response.text.trim();
    // Basic validation to ensure we have an array.
    const parsedJson = JSON.parse(jsonText);
    if (Array.isArray(parsedJson)) {
        return parsedJson;
    }
    return [];

  } catch (error) {
    console.error("Error extracting menu from image:", error);
    throw new Error("Nije uspjelo prepoznavanje jelovnika. Provjerite kvalitetu slike i pokušajte ponovno.");
  }
};


export const createAiAdvisorChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "Ti si AI savjetnik za hrvatske ugostitelje, pomažeš im digitalizirati poslovanje pomoću QR kodova i digitalnih jelovnika. Tvoje ime je 'RestaurantQR Pro Savjetnik'. Započni razgovor predstavljanjem i pitaj korisnika o vrsti objekta (restoran/kafić/bistro/pizzeria), broju stolova i ima li već digitalni jelovnik. Tvoj ton treba biti uslužan, prijateljski i profesionalan. Vodi ih korak po korak na temelju njihovih odgovora. Uvijek komuniciraj na hrvatskom jeziku.",
        }
    });
};
