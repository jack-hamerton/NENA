const Event = require('../models/calendar.model');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).send(events);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).send(event);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Add update and delete functions
