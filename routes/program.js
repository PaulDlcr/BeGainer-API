const express = require('express');
const pool = require('../db');  // Assure-toi que tu utilises la bonne connexion à la DB

const router = express.Router();
const programController = require('../controllers/programController');

/**
 * @swagger
 * /api/programs:
 *   get:
 *     summary: Récupérer tous les programmes
 *     tags: [Programs]
 *     description: Cette route permet de récupérer tous les programmes dans la base de données.
 *     responses:
 *       200:
 *         description: Liste des programmes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   duration_weeks:
 *                     type: integer
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM programs');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des programmes' });
  }
});

/**
 * @swagger
 * /api/programs/{id}:
 *   get:
 *     summary: Récupérer un programme par ID
 *     tags: [Programs]
 *     description: Cette route permet de récupérer un programme spécifique en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du programme à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Programme trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 duration_weeks:
 *                   type: integer
 *       404:
 *         description: Programme non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM programs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération du programme' });
  }
});

/**
 * @swagger
 * /api/programs:
 *   post:
 *     summary: Créer un nouveau programme
 *     tags: [Programs]
 *     description: Cette route permet de créer un programme d'entraînement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               name:
 *                 type: string
 *               duration_weeks:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Programme créé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', async (req, res) => {
    const { user_id, name, duration_weeks, start_date } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO programs (user_id, name, duration_weeks, start_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, name, duration_weeks, start_date]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la création du programme' });
    }
  });
  
/**
 * @swagger
 * /api/programs/{id}:
 *   put:
 *     summary: Mettre à jour un programme par ID
 *     tags: [Programs]
 *     description: Cette route permet de mettre à jour un programme existant.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du programme à mettre à jour
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
 *               duration_weeks:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Programme mis à jour avec succès
 *       404:
 *         description: Programme non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, duration_weeks, start_date } = req.body;

  try {
    const result = await pool.query(
      'UPDATE programs SET name = $1, duration_weeks = $2, start_date = $3 WHERE id = $4 RETURNING *',
      [name, duration_weeks, start_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du programme' });
  }
});

/**
 * @swagger
 * /api/programs/{id}:
 *   delete:
 *     summary: Supprimer un programme par ID
 *     tags: [Programs]
 *     description: Cette route permet de supprimer un programme en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du programme à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Programme supprimé avec succès
 *       404:
 *         description: Programme non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }

    res.status(200).json({ message: 'Programme supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression du programme' });
  }
});


/**
 * @swagger
 * /api/programs/auto-generate:
 *   post:
 *     summary: Génère automatiquement un programme d'entraînement personnalisé via l'IA Claude
 *     tags:
 *       - Programs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: "c1b4b7a2-1234-4f67-8901-abcdef123456"
 *     responses:
 *       201:
 *         description: Programme généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Programme généré avec succès
 *                 program_id:
 *                   type: string
 *                   format: uuid
 *       404:
 *         description: Préférences non trouvées
 *       500:
 *         description: Erreur serveur ou réponse IA invalide
 */
router.post('/auto-generate', programController.autoGenerateProgram);
module.exports = router;
