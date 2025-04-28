// routes/exercises.js
const express = require('express');
require('dotenv').config();
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Récupérer tous les exercices
 *     tags: [Exercises]
 *     description: Cette route permet de récupérer tous les exercices dans la base de données.
 *     responses:
 *       200:
 *         description: Liste des exercices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   type:
 *                     type: integer
 *                   muscle_group:
 *                     type: string
 *                   difficulty:
 *                     type: string
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM exercises');
      res.status(200).json(result.rows);  // Retourner tous les exercices
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la récupération des exercices' });
    }
  });

/**
 * @swagger
 * /api/exercises/{id}:
 *   get:
 *     summary: Récupérer un exercice par ID
 *     tags: [Exercises]
 *     description: Cette route permet de récupérer un exercice spécifique en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'exercice à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'exercice trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: integer
 *                 muscle_group:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *       404:
 *         description: Exercice non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM exercises WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Exercice non trouvé' });
      }
  
      res.status(200).json(result.rows[0]);  // Retourner l'exercice trouvé
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'exercice' });
    }
  });

/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Créer un nouvel exercice
 *     tags: [Exercises]
 *     description: Cette route permet de créer un nouvel exercice dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: integer
 *               muscle_group:
 *                 type: string
 *               difficulty:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exercice créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: integer
 *                 muscle_group:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', async (req, res) => {
  const { name, description, type, muscle_group, difficulty } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO exercises (name, description, type, muscle_group, difficulty) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, type, muscle_group, difficulty]
    );
    res.status(201).json(result.rows[0]);  // Retourner l'exercice créé
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'exercice' });
  }
});

/**
 * @swagger
 * /api/exercises/{id}:
 *   put:
 *     summary: Mettre à jour un exercice par ID
 *     tags: [Exercises]
 *     description: Cette route permet de mettre à jour un exercice existant en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'exercice à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: integer
 *               muscle_group:
 *                 type: string
 *               difficulty:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exercice mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: integer
 *                 muscle_group:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *       404:
 *         description: Exercice non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, type, muscle_group, difficulty } = req.body;

  try {
    const result = await pool.query(
      'UPDATE exercises SET name = $1, description = $2, type = $3, muscle_group = $4, difficulty = $5 WHERE id = $6 RETURNING *',
      [name, description, type, muscle_group, difficulty, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }

    res.status(200).json(result.rows[0]);  // Retourner l'exercice mis à jour
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'exercice' });
  }
});
  
/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Supprimer un exercice par ID
 *     tags: [Exercises]
 *     description: Cette route permet de supprimer un exercice en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'exercice à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercice supprimé avec succès
 *       404:
 *         description: Exercice non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM exercises WHERE id = $1 RETURNING *', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Exercice non trouvé' });
      }
  
      res.status(200).json({ message: 'Exercice supprimé avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'exercice' });
    }
  });

module.exports = router;
