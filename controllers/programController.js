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

    await pool.query(
      `UPDATE user_preferences
       SET active_program_id = $1
       WHERE user_id = $2`,
      [programId, userId]
    );

    for (const session of aiResponse) {
      const sessionId = uuidv4();

      await pool.query(
        `INSERT INTO program_sessions (id, program_id, name)
         VALUES ($1, $2, $3)`,
        [sessionId, programId, session.session_name]
      );

      for (const ex of session.exercises) {
        await pool.query(
          `INSERT INTO session_exercises (id, session_id, exercise_id, sets, reps, rest_time)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [uuidv4(), sessionId, ex.exercise_id, ex.sets, ex.reps, ex.rest_time]
        );
      }
    }

    res.status(201).json({ message: 'Programme structuré généré avec succès', program_id: programId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
