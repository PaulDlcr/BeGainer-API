const fetch = require('node-fetch');

exports.generateProgramWithClaude = async (preferences, exercises) => {

const dayMap = {
1: "Lundi", 2: "Mardi", 3: "Mercredi", 4: "Jeudi",
5: "Vendredi", 6: "Samedi", 7: "Dimanche"
};
const readableDays = preferences.training_days?.map(d => dayMap[d]).join(', ') || 'non précisé';

const prompt = `
Tu es un coach sportif IA.

Voici les préférences de l'utilisateur :
- Objectif : ${preferences.goal}
- Durée des séances : ${preferences.session_duration} minutes
- Jours d'entraînement par semaine (sous forme de numéro de jour, 1 = lundi, 7 = dimanche) : ${preferences.training_days.join(', ')}
- Interprétation : ${readableDays}
- Lieu d'entraînement : ${preferences.training_place} ${preferences.training_place === 'home_no_equipment' ? "(pas d'équipement, seulement poids du corps ou cardio libre)" : "(équipement de salle autorisé)"}

Voici les exercices disponibles (avec leurs contraintes) :
${exercises.map(e => 
  `- ID: ${e.id}, Nom: ${e.name}, Groupe: ${e.muscle_group}, Équipement: ${e.equipment}, Difficulté: ${e.difficulty}`
).join('\n')}

Génère un programme structuré sous forme d'un tableau JSON.

Chaque séance doit contenir uniquement :
- Crée ${preferences.training_days.length} séances correspondant aux jours listés.
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

Recommandation :
- Si l'utilisateur a un objectif de perte de poids, privilégie les exercices de cardio et de poids du corps.
- Si l'utilisateur a un objectif de prise de masse, privilégie les exercices de musculation avec poids.
- Si l'utilisateur a un objectif de santé, privilégie les exercices de mobilité et de renforcement musculaire.
- Si il y a trop de séances, définie une séance avec du cardio leger ou de la mobilité active en utilisant seulement les exercices de json.
- Si le temps des séances est supérieur à 90 minutes, vise un nombre d'exercices entre 5 et 6.

⚠️ Assure-toi que la réponse est un JSON **valide**, sans erreur de virgule ou de syntaxe. Chaque séance doit contenir les champs : session_name, day_number et exercises (au moins 1 exercice). 
Aucune séance ne doit être partielle ou incomplète.N'inclus aucun texte explicatif. Réponds uniquement avec le tableau.
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
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const content = data?.content?.[0]?.text;
  console.log('=== Contenu IA ===\n', content);
  // Nettoyage : on prend uniquement le JSON brut
  const start = content.indexOf('[');
  const end = content.lastIndexOf(']');
  const jsonRaw = content.slice(start, end + 1);

  try {
    const fixed = jsonRaw
    .replace(/}\s*{/g, '}, {') // Corrige des objets collés
    .replace(/"\s*([a-zA-Z_]+)\s*":/g, '"$1":') // Corrige des clés mal formatées
    .replace(/,\s*}/g, '}') // Vire virgule en fin d’objet
    .replace(/,\s*]/g, ']'); // Vire virgule en fin de tableau
  return JSON.parse(fixed);

  } catch (err) {
    console.error("Erreur parsing IA:", err);
    return null;
  }
};
