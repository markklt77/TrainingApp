const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Workout, Exercise, ExerciseType, User } = require('../../db/models')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateWorkoutCreation = [
    requireAuth,
    check('focus')
        .exists({ checkFalsy:true })
        .withMessage('Please provide a focus for this workout'),
    handleValidationErrors
]

const validateExerciseCreation = [
    requireAuth,
    check('sets')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a number of sets for this workout')
        .isInt({ min: 1 })
        .withMessage('Sets must be a positive integer'),
    check('reps')
        .exists({ checkFalsy: true })
        .withMessage('Please provide how many reps will be done each set')
        .isInt({ min: 1 })
        .withMessage('Reps must be a positive integer'),
    check('weight')
        .exists({ checkFalsy: true })
        .withMessage('Please provide the amount of weight used')
        .isFloat({ min: 0 })
        .withMessage('Weight must be a non-negative number'),
    check('exerciseTypeId')
        .exists({ checkFalsy: true })
        .withMessage('Please provide the id for the chosen exerciseType')
        .isInt({ min: 1 })
        .withMessage('Id must be a postive integer'),
    handleValidationErrors
];

router.get('/', requireAuth, async (req, res) => {

        const userId = req.user.id;
        const workouts = await Workout.findAll({
            where: { userId },
            include: [
                {
                    model: Exercise,
                    attributes: ['id', 'sets', 'reps', 'weight'],
                    include: [
                        {
                            model: ExerciseType,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ]
        });

        return res.json(workouts);
});

router.get('/:workoutId', requireAuth, async(req, res) => {

        const workoutId = req.params.workoutId;
        const userId = req.user.id
        const workout = await Workout.findOne({
            where: {
                id: workoutId,
                userId: userId,
            },
            include: [
                {
                    model: Exercise,
                    attributes: ['id', 'sets', 'reps', 'weight'],
                    include: [
                        {
                            model: ExerciseType,
                            attributes: ['name'],
                        },
                    ],
                },
                {
                    model: User,
                    attributes: ['id', 'username'],
                },
            ],
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(200).json(workout)
})

router.post('/', validateWorkoutCreation, async(req, res) => {
    const { focus } = req.body
    const newWorkout = await Workout.create({
        focus: focus,
        userId: req.user.id
    })

    return res.status(201).json({
        newWorkout
    })
})

router.post('/:workoutId/exercises', validateExerciseCreation, async(req, res) => {
    const { sets, reps, weight, exerciseTypeId} = req.body;
    const newExercise = await Exercise.create({
        sets,
        reps,
        weight,
        exerciseTypeId,
        userId: req.user.id,
        workoutId: req.params.workoutId
    })

    return res.status(201).json({
        newExercise
    })
})

router.put('/:workoutId', validateWorkoutCreation, async(req, res) => {
    const { workoutId } = req.params;
    const { focus } = req.body;

    const workout = await Workout.findOne({
        where: {
            id: workoutId,
            userId: req.user.id
        }
    });

    if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
    }

    workout.focus = focus;
    await workout.save();

    return res.status(200).json({
        message: 'Workout updated successfully',
        workout,
    });
})

router.delete('/:workoutId', requireAuth, async (req, res) => {

    const workout = await Workout.findOne({
        where: {
            id: req.params.workoutId,
            userId: req.user.id
        }
    });

    if (!workout) {
        return res.status(404).json({error: 'Workout not found'})
    } else {
        await workout.destroy();
    }


    res.status(200).json( {message: 'Successfully deleted'} )

})


module.exports = router;