const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

// Get all events with filters
router.get('/', async (req, res) => {
    try {
        const { category, search, startDate, endDate } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const events = await Event.find(query).populate('registeredUsers', 'username');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new event
router.post('/', async (req, res) => {
    try {
        const { title, date, description, category, capacity } = req.body;

        // Validate required fields
        if (!title || !date || !description || !category || !capacity) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create new event
        const newEvent = new Event({
            title,
            date,
            description,
            category,
            capacity: parseInt(capacity),
            registeredUsers: []
        });

        // Save to database
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Error creating event' });
    }
});

// Register for an event
router.post('/:eventId/register', async (req, res) => {
    try {
        const { userId, name, email } = req.body;
        
        // Find the event
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if user is already registered
        if (event.registeredUsers.includes(userId)) {
            return res.status(400).json({ error: 'Already registered for this event' });
        }

        // Check if event is full
        if (event.registeredUsers.length >= event.capacity) {
            return res.status(400).json({ error: 'Event is full' });
        }

        // Add user to registered users
        event.registeredUsers.push(userId);
        await event.save();

        res.json({ 
            message: 'Successfully registered for event',
            event: event
        });
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: 'Error registering for event' });
    }
});

// Toggle favorite event
router.post('/:eventId/favorite', async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        const eventId = req.params.eventId;

        const eventIndex = user.favoriteEvents.indexOf(eventId);
        if (eventIndex > -1) {
            user.favoriteEvents.splice(eventIndex, 1);
        } else {
            user.favoriteEvents.push(eventId);
        }

        await user.save();
        res.json({ 
            message: eventIndex > -1 ? 'Removed from favorites' : 'Added to favorites',
            isFavorite: eventIndex === -1
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's registered events
router.get('/user/:userId/registered', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate({
                path: 'registeredEvents.event',
                model: 'Event'
            });
        res.json(user.registeredEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's favorite events
router.get('/user/:userId/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('favoriteEvents');
        res.json(user.favoriteEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
