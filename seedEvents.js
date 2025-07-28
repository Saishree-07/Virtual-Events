const mongoose = require('mongoose');
const Event = require('./models/Event');

// Sample events data
const events = [
  {
    title: 'Web Development Workshop',
    date: new Date('2025-02-15'),
    description: 'Learn modern web development techniques using React, Node.js, and MongoDB. Perfect for beginners and intermediate developers.',
    category: 'Tech',
    capacity: 50,
    registeredUsers: []
  },
  {
    title: 'Digital Marketing Masterclass',
    date: new Date('2025-02-20'),
    description: 'Master the art of digital marketing with focus on SEO, social media marketing, and content strategy.',
    category: 'Marketing',
    capacity: 100,
    registeredUsers: []
  },
  {
    title: 'Startup Funding Workshop',
    date: new Date('2025-03-01'),
    description: 'Learn how to secure funding for your startup. Topics include pitch deck creation, networking with investors, and funding options.',
    category: 'Business',
    capacity: 75,
    registeredUsers: []
  },
  {
    title: 'UI/UX Design Fundamentals',
    date: new Date('2025-03-10'),
    description: 'Master the basics of UI/UX design. Learn about user research, wireframing, prototyping, and design principles.',
    category: 'Design',
    capacity: 40,
    registeredUsers: []
  },
  {
    title: 'Machine Learning Bootcamp',
    date: new Date('2025-03-15'),
    description: 'Intensive bootcamp covering machine learning fundamentals, algorithms, and practical applications using Python.',
    category: 'Tech',
    capacity: 30,
    registeredUsers: []
  },
  {
    title: 'Content Creation Workshop',
    date: new Date('2025-03-20'),
    description: 'Learn to create engaging content for various platforms. Includes video production, blog writing, and social media content.',
    category: 'Marketing',
    capacity: 60,
    registeredUsers: []
  },
  {
    title: 'Financial Planning Seminar',
    date: new Date('2025-04-01'),
    description: 'Expert guidance on personal finance management, investment strategies, and retirement planning.',
    category: 'Business',
    capacity: 120,
    registeredUsers: []
  },
  {
    title: 'Mobile App Development',
    date: new Date('2025-04-10'),
    description: 'Comprehensive course on mobile app development using React Native. Build cross-platform applications.',
    category: 'Tech',
    capacity: 45,
    registeredUsers: []
  },
  {
    title: 'Leadership Skills Workshop',
    date: new Date('2025-04-15'),
    description: 'Develop essential leadership skills including team management, communication, and decision-making.',
    category: 'Business',
    capacity: 50,
    registeredUsers: []
  },
  {
    title: 'Graphic Design Essentials',
    date: new Date('2025-04-20'),
    description: 'Learn the fundamentals of graphic design including typography, color theory, and composition.',
    category: 'Design',
    capacity: 35,
    registeredUsers: []
  },
  {
    title: 'Data Science Conference',
    date: new Date('2025-05-01'),
    description: 'Annual conference featuring talks on big data, analytics, and artificial intelligence.',
    category: 'Tech',
    capacity: 200,
    registeredUsers: []
  },
  {
    title: 'E-commerce Strategy Summit',
    date: new Date('2025-05-10'),
    description: 'Learn successful e-commerce strategies, including platform selection, marketing, and customer service.',
    category: 'Business',
    capacity: 80,
    registeredUsers: []
  }
];

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/virtual_event_db')
  .then(() => {
    console.log('Connected to MongoDB');
    seedEvents();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to seed events
async function seedEvents() {
  try {
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert new events
    const createdEvents = await Event.insertMany(events);
    console.log(`Successfully added ${createdEvents.length} events`);
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding events:', error);
    mongoose.connection.close();
  }
}
