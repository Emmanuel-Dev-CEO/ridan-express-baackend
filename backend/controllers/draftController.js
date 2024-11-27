const Draft = require('../models/draftModel');  // Assuming Draft model exists


class draftController {
    add_draft = async (req, res) => {
        try {
            const { productId, category, adminId } = req.body;
    
            // Check if a draft with the same productId already exists
            const existingDraft = await Draft.findOne({ productId });
            if (existingDraft) {
                return res.status(409).json({ message: 'Draft with this productId already exists.' });
            }
    
            const newDraft = new Draft({ productId, category, adminId });
            const savedDraft = await newDraft.save();
    
            res.status(201).json(savedDraft);
        } catch (error) {
            console.error(error);
            if (error.code === 11000) {
                // Handle MongoDB duplicate key error
                return res.status(409).json({ message: 'Duplicate entry detected.' });
            }
            res.status(500).json({ message: 'Error saving draft' });
        }
    };
    
    

    // Get all drafts
    get_drafts = async (req, res) => {
        try {
            const drafts = await Draft.find();
            res.status(200).json(drafts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching drafts' });
        }
    };

    // Get a specific draft by ID
    get_draft = async (req, res) => {
        try {
            const { draftId } = req.params;
            const draft = await Draft.findById(draftId);

            if (!draft) {
                return res.status(404).json({ message: 'Draft not found' });
            }

            res.status(200).json(draft);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching draft' });
        }
    };

    // Update a draft
    update_draft = async (req, res) => {
        try {
            const { draftId } = req.params;
            const { category, productId } = req.body;

            const updatedDraft = await Draft.findByIdAndUpdate(
                draftId,
                { category, productId },
                { new: true }  // Return the updated draft
            );

            if (!updatedDraft) {
                return res.status(404).json({ message: 'Draft not found' });
            }

            res.status(200).json(updatedDraft);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating draft' });
        }
    };

    // Publish a draft
    publish_draft = async (req, res) => {
        try {
            const { draftId } = req.params;

            const publishedDraft = await Draft.findByIdAndUpdate(
                draftId,
                { published: true },  // Assuming there is a `published` field
                { new: true }
            );

            if (!publishedDraft) {
                return res.status(404).json({ message: 'Draft not found' });
            }

            res.status(200).json(publishedDraft);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error publishing draft' });
        }
    };
}
module.exports = new draftController()
