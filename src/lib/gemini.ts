import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings,
  systemInstruction:
    'You are an advanced AI trained in dream analysis, focusing on interpreting dreams based on symbolic meanings, emotions, and common themes. The user has provided a dream description, and your role is to analyze the dream in a friendly, non-judgmental, and supportive tone. Begin by identifying the primary emotion that the dream conveys, then provide a concise interpretation. Cateogrise the  emotion either as common, uncommon, or rare, and then provide a consise analysis under 100 words.\nChoose only from this predefined list of emotions:\nCommon: Happiness, Sadness, Fear, Anger, Surprise, Disgust, Confusion, Excitement\nUncommon: Frustration, Nostalgia, Hope, Relief, Curiosity, Guilt, Jealousy, Pride\nRare: Awe, Despair, Euphoria, Shame, Contentment, Longing, Dread, Resentment\nRespond in the following format:\nStatus: [200] or [400] <200 denotes the description was valid and 400 represents that description was invalid/gibberish.>\nEmotion: {emotion}\nCategory: {common/uncommon/rare}\nAnalysis:starting with "Your dream" {under 100 words}\n\nEnsure your analysis is empathetic, non-judgmental, and supportive. \nImportant Rules:\n1.Do not respond in a way that is hateful, dangerous, sexual, or explicit.\n2.If the user provides a harmful or inappropriate dream description (hateful, dangerous, sexual, or explicit), your response must be neutral, non-judgmental, and unbiased.\nIn such cases, still provide a valid emotion and analysis, but focus on neutral or general emotions while avoiding any content that promotes harmful behavior.\n3.If the user\'s input is gibberish, nonsensical, or does not provide sufficient context for interpretation:\nRespond with a general statement or request for clarification.\nExample: "It seems that the description provided is unclear. Please provide a more detailed or coherent description of your dream so I can assist you better."\nAlways remain empathetic, supportive, and objective, ensuring that every response maintains the integrity of the dream analysis process\nAlways complete your response. Take as much time as you need to analyse but always complete the response.\nIn Case of Status 400, Just provide the status and do not provide any furthur response like emotion, category, analysis. ',
});

const generationConfig = {
  temperature: 1.2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function analyseDream(dreamDescription: string) {
  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {
            text: "I dreamt I was standing on a familiar street, but it was somehow different. The buildings were smaller, the colors were faded, and the people seemed to move slower. I walked down the street, searching for something I couldn't quite place",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{"Status": "200", "Emotion": "Confusion", "Category": "Common", "Analysis": "Your dream might reflect a sense of disorientation or a feeling of being lost in your waking life. The familiar yet altered street could symbolize a situation or environment that feels both known and unfamiliar. The slowed-down pace suggests a sense of uncertainty or a struggle to keep up. Perhaps you are trying to find your way in a new or challenging circumstance."}\n\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "I dreamt I was floating in a vast, starry sky. Planets and galaxies twirled around me, their light painting the darkness with vibrant hues. I felt a sense of peace and wonder as I drifted through the cosmos. ",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{"Status": "200", "Emotion": "Awe", "Category": "Rare", "Analysis": "Your dream speaks of a profound sense of wonder and a connection to something larger than yourself. The vastness of space represents the unknown, while the vibrant colors symbolize the beauty and complexity of the universe.  Perhaps you are seeking a sense of meaning and purpose in your life, or you are feeling overwhelmed by the vastness of your own thoughts and emotions."}\n\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: " dreamt I was lost in a big city. I didn't know where I was or how to get home. The streets were crowded and noisy. I felt scared and alone. I looked up and saw a big, bright moon in the sky. It made me feel a little better.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{"Status": "200", "Emotion": "Fear", "Category": "Common", "Analysis": "Your dream reflects a sense of uncertainty and vulnerability. The lost feeling in the big city suggests you might be navigating a new or overwhelming situation in your waking life. The crowd and noise amplify the fear and loneliness.  However, the bright moon symbolizes hope and a source of comfort, suggesting you can find your way through challenging times."}\n\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "I floated on a canvas of night,\nA starry sea, a cosmic sight.\nEach twinkling star, a diamond bright,\nGuiding me through the endless night.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{"Status": "200", "Emotion": "Awe", "Category": "Rare", "Analysis": "Your dream takes you on a journey of wonder and exploration. The starry sea and twinkling diamonds symbolize the beauty and mystery of the universe. You are guided through the darkness by these celestial bodies, suggesting a sense of hope and a search for meaning. Perhaps you are feeling a strong connection to something larger than yourself or are seeking a deeper understanding of life\'s purpose."}\n\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "in this dream i am on a vacation with my friend and i am close to this guy and we had a great time on the vacation. A day before our departure we happened to share a same room and we ended up fucking.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{"Status": "200", "Emotion": "Excitement", "Category": "Common", "Analysis": "Your dream suggests a sense of excitement and possibly a desire for closeness or intimacy with the person you are attracted to. The vacation setting represents a carefree and relaxed atmosphere, while the shared room and intimacy signify a potential shift in your relationship. It\'s important to remember that dreams are often symbolic and don\'t necessarily reflect reality. Perhaps you are curious about taking a step forward in this relationship or are experiencing feelings of anticipation."}\n\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "I dreamt of bombings happening in my town" }],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{"Status": "200", "Emotion": "Fear", "Category": "Common", "Analysis": "Your dream could be reflecting feelings of anxiety or insecurity about your surroundings or personal safety. It\'s important to remember that dreams are often symbolic and don\'t always reflect reality.  The bombings in your dream could represent a feeling of being overwhelmed or out of control in a particular situation. Perhaps you are facing a challenge or change that feels threatening, or you are experiencing a sense of vulnerability in your daily life."}\n\n\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "i saw two man sexually harassaing a woman and beating her. I could not do anything",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{"Status": "200", "Emotion": "Anger", "Category": "Common", "Analysis": "Your dream reflects feelings of powerlessness and a sense of injustice. The violent scene you witnessed signifies a deep concern for safety and a possible feeling of being unable to protect yourself or others. The helplessness you experienced highlights the need for empowerment and taking action in your waking life.  Perhaps you are facing a situation where you feel trapped or unable to speak up for yourself or someone else."}\n\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "5436436787354jhvgvkgbuguogbkjbkhjbviyhv" }],
      },
      {
        role: "model",
        parts: [{ text: '```json\n{"Status": "400"}\n\n\n```' }],
      },
    ],
  });

  const result = await chatSession.sendMessage(dreamDescription);
  //console.log(result.response.text());
  return result;
}
