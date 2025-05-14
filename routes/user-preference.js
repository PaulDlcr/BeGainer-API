const express = require('express');
const pool = require('../db');  // Assure-toi que tu utilises la bonne connexion à la DB

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: UserPreferences
 *   description: Gestion des préférences utilisateur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPreference:
 *       type: object
 *       required:
 *         - user_id
 *         - name
 *         - gender
 *         - age
 *         - height_cm
 *         - weight_kg
 *         - training_freq
 *         - goal
 *         - training_place
 *         - session_length
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         age:
 *           type: integer
 *         height_cm:
 *           type: integer
 *         weight_kg:
 *           type: integer
 *         training_freq:
 *           type: integer
 *         goal:
 *           type: string
 *           enum: [lose weight, gain muscle, improve health]
 *         training_place:
 *           type: string
 *           enum: [gym, home_no_equipment]
 *         session_length:
 *           type: integer
 *         milestone:
 *           type: string
 */

/**
 * @swagger
 * /api/user-preferences:
 *   post:
 *     summary: Créer les préférences d'un utilisateur
 *     tags: [UserPreferences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPreference'
 *     responses:
 *       201:
 *         description: Préférences créées
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreference'
 */
router.post('/', async (req, res) => {
    try {
      const {
        user_id, name, gender, age, height_cm, weight_kg,
        training_freq, goal, training_place, session_length, milestone
      } = req.body;
  
      const result = await pool.query(
        `INSERT INTO user_preferences (
          user_id, name, gender, age, height_cm, weight_kg,
          training_freq, goal, training_place, session_length, milestone
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *`,
        [
          user_id, name, gender, age, height_cm, weight_kg,
          training_freq, goal, training_place, session_length, milestone
        ]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });

/**
 * @swagger
 * /api/user-preferences:
 *   get:
 *     summary: Récupérer toutes les préférences
 *     tags: [UserPreferences]
 *     responses:
 *       200:
 *         description: Liste des préférences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPreference'
 */
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM user_preferences');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

/**
 * @swagger
 * /api/user-preferences/{user_id}:
 *   get:
 *     summary: Récupérer les préférences d'un utilisateur par ID
 *     tags: [UserPreferences]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Préférences trouvées
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreference'
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const result = await pool.query(
        'SELECT * FROM user_preferences WHERE user_id = $1',
        [user_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

/**
 * @swagger
 * /api/user-preferences/{user_id}:
 *   put:
 *     summary: Mettre à jour les préférences d'un utilisateur
 *     tags: [UserPreferences]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPreference'
 *     responses:
 *       200:
 *         description: Préférences mises à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreference'
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const {
        name, gender, age, height_cm, weight_kg,
        training_freq, goal, training_place, session_length, milestone
      } = req.body;
  
      const result = await pool.query(
        `UPDATE user_preferences SET
          name = $1,
          gender = $2,
          age = $3,
          height_cm = $4,
          weight_kg = $5,
          training_freq = $6,
          goal = $7,
          training_place = $8,
          session_length = $9,
          milestone = $10
        WHERE user_id = $11
        RETURNING *`,
        [
          name, gender, age, height_cm, weight_kg,
          training_freq, goal, training_place, session_length, milestone, user_id
        ]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

/**
 * @swagger
 * /api/user-preferences/{user_id}:
 *   delete:
 *     summary: Supprimer les préférences d'un utilisateur
 *     tags: [UserPreferences]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Préférences supprimées
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const result = await pool.query(
        'DELETE FROM user_preferences WHERE user_id = $1 RETURNING *',
        [user_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }
  
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  module.exports = router;