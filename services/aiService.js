const fetch = require('node-fetch');

exports.generateProgramWithClaude = async (preferences, exercises) => {
const prompt = `
Tu es un coach sportif IA.

Objectif de l'utilisateur : ${preferences.goal}
Durée des séances : ${preferences.session_duration} minutes
Nombre de séances par semaine : ${preferences.training_days}

Exercices disponibles :
${exercises.map(ex => `- ${ex.name} (ID: ${ex.id}, groupe musculaire: ${ex.muscle_group}, difficulté: ${ex.difficulty})`).join('\n')}

Génère un programme personnalisé sous forme de tableau JSON uniquement.

Format attendu :
[
  {
    "exercise_id": "UUID",
    "name": "Nom personnalisé de l'exercice",
    "sets": 3,
    "reps": 12,
    "rest_time": 60
  }
]
Ne réponds qu'avec ce tableau JSON, sans texte explicatif.
`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const content = data?.content?.[0]?.text;

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("Erreur parsing IA:", err);
    return null;
  }
};
