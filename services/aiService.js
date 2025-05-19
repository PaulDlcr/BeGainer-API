const fetch = require('node-fetch');

exports.generateProgramWithClaude = async (preferences, exercises) => {

const dayMap = {
1: "Lundi", 2: "Mardi", 3: "Mercredi", 4: "Jeudi",
5: "Vendredi", 6: "Samedi", 7: "Dimanche"
};
const readableDays = preferences.training_days?.map(d => dayMap[d]).join(', ') || 'non précisé';

const prompt = `
Tu es un coach sportif IA expert en programmation d'entraînement personnalisé.

Voici les préférences de l'utilisateur :
- Objectif : ${preferences.goal}
-  Durée des séances : ${preferences.session_duration} minutes
- Jours d'entraînement par semaine (sous forme de numéro de jour, 1 = lundi, 7 = dimanche) : ${preferences.training_days.join(', ')}
- Lieu d'entraînement : ${preferences.training_place} ${preferences.training_place === 'home_no_equipment' ? "(pas d'équipement, seulement poids du corps ou cardio libre)" : "(équipement de salle autorisé)"}

Voici les exercices disponibles (avec leurs contraintes) :
${exercises.map(e => 
  `- ID: ${e.id}, Nom: ${e.name}, Groupe: ${e.muscle_group}`
).join('\n')}

Génère un programme structuré sous forme d'un tableau JSON.
Ta mission est de générer exactement ${preferences.training_days.length} séances d'entraînement personnalisées, adaptées aux préférences ci-dessus.

Chaque séance doit contenir uniquement :
- Crée ${preferences.training_days.length} séances correspondant aux jours listés.
- des exercices **sans équipement** si training_place = "home_no_equipment"
- une variété de groupes musculaires cohérents
- un nom de séance explicite

### Format attendu :
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

### Contraintes à respecter :

- Chaque séance **doit** inclure :
  - un champ "session_name" (ex. "Séance 1 - Haut du corps")
  - un champ "day_number" (entier compris dans ${preferences.training_days.join(', ')})
  - un tableau "exercises" avec :
    - "exercise_id" (ID de l'exercice sélectionné parmi ceux listés)
    - "sets" (entre 3 et 4 pour chaque exo)
    - "reps"
    - "rest_time" (en secondes)

  - Le **nombre total de sets par séance** doit correspondre à la durée :
    - Environ **14-16 sets** pour 60 minutes
    - Environ **20-24 sets** pour 90 minutes
    - Environ **28-32 sets** pour 120 minutes
    - Utilise cette contrainte pour déduire le bon **nombre d'exercices**
      (ex : 6 exercices * 4 sets = 24 sets)
    - Le **nombre de répétitions** doit être compris entre 8 et 12
    - Chaque exercice de musculation doit avoir **3 à 4 sets**
    - Le **temps de repos** doit être compris entre 30 et 90 secondes

  - Si training_place = home_no_equipment, **utilise uniquement des exercices sans machine ni équipement**
  - Adapter le type d'exercices selon l'objectif :
    - lose weight → cardio + poids du corps
    - gain muscle → musculation structurée avec bons groupes musculaires
    - improve health → mobilité, stabilité, renforcement général


### IMPORTANT :
- Réponds **uniquement** avec un tableau JSON (aucune explication, aucun texte autour)
- Le JSON **doit être valide** : pas de virgule manquante ou superflue, pas de guillemets oubliés
- **Aucune séance ne doit être incomplète** (chaque séance doit contenir les 3 champs obligatoires)
`;


  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL,
      max_tokens: 3000,
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
