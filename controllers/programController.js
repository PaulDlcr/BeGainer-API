const pool = require('../db');
const { generateProgramWithClaude } = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');

exports.autoGenerateProgram = async (req, res) => {
  const userId = req.body.user_id; // à sécuriser plus tard avec JWT

  try {
    // 1. Récupérer préférences
    const prefResult = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    const preferences = prefResult.rows[0];
    if (!preferences) return res.status(404).json({ error: 'Préférences non trouvées' });

    // 2. Récupérer exercices
    const exoResult = await pool.query('SELECT * FROM exercises');
    const exercises = exoResult.rows;

    // 3. Appeler l'IA Claude avec prompt formaté
    const aiResponse = await generateProgramWithClaude(preferences, exercises);
    if (!Array.isArray(aiResponse)) return res.status(500).json({ error: 'Réponse IA invalide' });

    // 4. Créer le programme
    const programId = uuidv4();
    await pool.query(
      `INSERT INTO programs (id, user_id, name, goal, duration_weeks)
       VALUES ($1, $2, $3, $4, $5)`,
      [programId, userId, "Programme IA", preferences.goal, preferences.duration_weeks || 6]
    );

    // 5. Insérer les exercices du programme
    for (const item of aiResponse) {
      await pool.query(
        `INSERT INTO program_exercises (id, program_id, exercise_id, sets, reps, rest_time)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), programId, item.exercise_id, item.sets, item.reps, item.rest_time]
      );
    }

    res.status(201).json({ message: 'Programme généré avec succès', program_id: programId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
