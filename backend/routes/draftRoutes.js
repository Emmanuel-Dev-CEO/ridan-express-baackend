const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const draftController = require('../controllers/draftController'); // Make sure this file exists

// Route to add a draft (POST request)
router.post('/api/drafts', authMiddleware, draftController.add_draft);

// Route to get drafts (GET request)
router.get('/api/drafts', authMiddleware, draftController.get_drafts);

// Route to get a specific draft by its ID (GET request)
router.get('/api/drafts/:draftId', authMiddleware, draftController.get_draft);

// Route to update a draft (PUT request)
router.put('/api/drafts/:draftId', authMiddleware, draftController.update_draft);

// Route to publish a draft (PUT request)
router.put('/api/drafts/:draftId/publish', authMiddleware, draftController.publish_draft);

module.exports = router;
