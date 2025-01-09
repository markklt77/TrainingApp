const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const { ExerciseType, Exercise, ExerciseSet } = require('../../db/models');
const user = require('../../db/models/user');

const router = express.Router();

const validateExerciseTypeCreation = [
    requireAuth,
    check('name')
        .exists({ checkFalsy:true })
        .withMessage('Please provide a valid ExerciseType'),
    handleValidationErrors
]

router.get('/exerciseTypes', requireAuth, async (req, res) => {

    const exerciseTypes = await ExerciseType.findAll({
        where: {
            userId: req.user.id
        },
        attributes: ['id', 'name'],
        order: [['name', 'ASC']]
    });

    if (exerciseTypes.length === 0) {
        return res.status(404).json({ message: 'No exercise types found.' });
    }

    return res.status(200).json(exerciseTypes);

});

router.get('/:exerciseTypeId', requireAuth, async(req, res) => {
    const { exerciseTypeId } = req.params;

    const exercises = await Exercise.findAll({
        where: { exerciseTypeId },
        include: [
            { model: ExerciseSet },
            { model: ExerciseType }
        ],
        order: [['createdAt', 'DESC']]
    })

    if (!exercises || exercises.length === 0) {
        return res.status(404).json({ message: 'No exercises found for this type.' });
    }

    res.status(200).json(exercises);
})

router.post('/exerciseTypes', validateExerciseTypeCreation, async (req, res) => {
    const { name } = req.body;

    const newExerciseType = await ExerciseType.create({
        userId: req.user.id,
        name: name.trim()
    });

    return res.status(201).json(newExerciseType);
})



module.exports = router;
