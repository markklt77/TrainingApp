const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Weight, User} = require('../../db/models')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateWeight = [
    requireAuth,
    check('weight')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a valid weight.'),
    handleValidationErrors
  ];

router.get('/', requireAuth, async(req, res) => {
    try {

        const userId = req.user.id;

        const weights = await Weight.findAll({
            where: {
                userId: userId,
            },
            order: [['createdAt', 'DESC']]
        });

        return res.json({ weights });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve weights.' });
    }
})

router.post('/', validateWeight, async (req, res) => {
    try {
        const { weight } = req.body;


        const userId = req.user.id;


        const newWeight = await Weight.create({
            userId,
            weight
        });

        return res.status(201).json({ message: 'Weight added successfully', newWeight });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to add weight.' });
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const weight = await Weight.findOne({
            where: {
                id,
                userId
            }
        });

        if (!weight) {
            return res.status(404).json({ message: 'Weight not found.'});
        }

        await weight.destroy();

        return res.json({ message: 'Weight deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete weight.' });
    }
});

router.put('/:id', validateWeight, async (req, res) => {
    try {
        const { id } = req.params;
        const { weight } = req.body;
        const userId = req.user.id;


        const weightEntry = await Weight.findOne({
            where: {
                id,
                userId
            }
        });

        if (!weightEntry) {
            return res.status(404).json({ message: 'Weight entry not found.' });
        }


        weightEntry.weight = weight;

        await weightEntry.save();

        return res.json({ message: 'Weight updated successfully', weightEntry });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update weight.' });
    }
});


module.exports = router;
