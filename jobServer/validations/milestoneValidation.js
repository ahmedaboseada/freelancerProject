const { body, param, query } = require('express-validator');

const createMilestonesValidation = [
    param('jobId')
        .isMongoId()
        .withMessage('Invalid job ID format'),
    
    body('milestones')
        .isArray({ min: 1 })
        .withMessage('At least one milestone is required'),
    
    body('milestones.*.title')
        .isLength({ min: 20, max: 255 })
        .withMessage('Milestone title must be between 20 and 255 characters'),
    
    body('milestones.*.description')
        .isLength({ min: 50, max: 2000 })
        .withMessage('Milestone description must be between 50 and 2000 characters'),
    
    body('milestones.*.amount')
        .optional()
        .isFloat({ min: 1 })
        .withMessage('Milestone amount must be at least 1'),
    
    body('milestones.*.dueDate')
        .isISO8601()
        .withMessage('Due date must be a valid date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Due date must be in the future');
            }
            return true;
        })
];

const submitMilestoneValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid milestone ID format'),
    
    body('deliverableUrl')
        .notEmpty()
        .withMessage('Deliverable URL is required')
        .isURL()
        .withMessage('Please provide a valid URL')
];

const rejectMilestoneValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid milestone ID format'),
    
    body('reason')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Rejection reason must not exceed 500 characters')
];

const milestoneIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid milestone ID format')
];

const jobIdValidation = [
    param('jobId')
        .isMongoId()
        .withMessage('Invalid job ID format')
];

const freelancerMilestonesValidation = [
    param('freelancerId')
        .isMongoId()
        .withMessage('Invalid freelancer ID format'),
    
    query('status')
        .optional()
        .isIn(['pending', 'submitted', 'approved', 'rejected'])
        .withMessage('Invalid status value'),
    
    query('jobId')
        .optional()
        .isMongoId()
        .withMessage('Invalid job ID format'),
    
    query('sort')
        .optional()
        .isIn(['dueDate', 'createdAt', 'amount'])
        .withMessage('Invalid sort value')
];

module.exports = {
    createMilestonesValidation,
    submitMilestoneValidation,
    rejectMilestoneValidation,
    milestoneIdValidation,
    jobIdValidation,
    freelancerMilestonesValidation
};
