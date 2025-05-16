const fetch = require('node-fetch');

exports.generateProgramWithClaude = async (preferences, exercises) => {
const prompt = `
Tu es un coach sportif IA.

Voici les préférences de l’utilisateur :
- Objectif : ${preferences.goal}
- Durée des séances : ${preferences.session_duration} minutes
- Nombre de séances par semaine : ${preferences.training_days}
- Lieu d'entraînement : ${preferences.training_place} ${preferences.training_place === 'home_no_equipment' ? "(pas d'équipement, seulement poids du corps ou cardio libre)" : "(équipement de salle autorisé)"}

Voici les exercices disponibles (avec leurs contraintes) :
${exercises.map(e => 
  `- ID: ${e.id}, Nom: ${e.name}, Groupe: ${e.muscle_group}, Équipement: ${e.equipment}, Difficulté: ${e.difficulty}`
).join('\n')}

Ta tâche : Génère un programme structuré en ${preferences.training_days} séances hebdomadaires).

Chaque séance doit contenir uniquement :
- des exercices **sans équipement** si training_place = "home_no_equipment"
- une variété de groupes musculaires cohérents
- un nom de séance explicite
- 3 à 6 exercices maximum

**Format JSON strict attendu :**
[
  {
    "session_name": "Nom de la séance",
    "day_number": 1,
    "exercises": [
      {
        "exercise_id": "uuid-existant",
        "sets": 4,
        "reps": 12,
        "rest_time": 60
      }
    ]
  }
]

Réponds uniquement avec ce tableau JSON. Aucun texte explicatif, pas d'introduction.
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
  console.log('=== Contenu IA ===\n', content);

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("Erreur parsing IA:", err);
    return null;
  }
};
