// Populates the database with realistic demo data so the app isn't empty on first run.
// Run with: npm run seed        (from the server/ folder)
// Wipe with: npm run seed:destroy
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const User = require('../models/User');
const Course = require('../models/Course');
const Club = require('../models/Club');
const Event = require('../models/Event');
const Notice = require('../models/Notice');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding.');

  if (process.argv.includes('--destroy')) {
    await Promise.all([
      User.deleteMany(),
      Course.deleteMany(),
      Club.deleteMany(),
      Event.deleteMany(),
      Notice.deleteMany(),
      Conversation.deleteMany(),
      Message.deleteMany(),
    ]);
    console.log('All collections cleared.');
    return mongoose.disconnect();
  }

  await Promise.all([
    User.deleteMany(),
    Course.deleteMany(),
    Club.deleteMany(),
    Event.deleteMany(),
    Notice.deleteMany(),
    Conversation.deleteMany(),
    Message.deleteMany(),
  ]);

  // --- Users -----------------------------------------------------------
  const admin = await User.create({
    name: 'System Administrator',
    email: 'admin@academiaconnect.edu',
    password: 'admin123',
    role: 'admin',
    department: 'Registrar\'s Office',
    bio: 'Keeping AcademiaConnect running.',
  });

  const [ayesha, tanvir, nusrat, fahim, rakib] = await User.create([
    {
      name: 'Ayesha Rahman',
      email: 'ayesha.rahman@student.academiaconnect.edu',
      password: 'password123',
      studentId: '011231045',
      department: 'Computer Science & Engineering',
      batch: 'Spring 2023',
      bio: 'CSE junior interested in AI and competitive programming.',
    },
    {
      name: 'Tanvir Ahmed',
      email: 'tanvir.ahmed@student.academiaconnect.edu',
      password: 'password123',
      studentId: '011231089',
      department: 'Computer Science & Engineering',
      batch: 'Spring 2023',
      bio: 'Backend enthusiast. Runs the Programming Club Discord.',
    },
    {
      name: 'Nusrat Jahan',
      email: 'nusrat.jahan@student.academiaconnect.edu',
      password: 'password123',
      studentId: '021221033',
      department: 'Electrical & Electronic Engineering',
      batch: 'Fall 2022',
      bio: 'EEE student, robotics team lead.',
    },
    {
      name: 'Fahim Chowdhury',
      email: 'fahim.chowdhury@student.academiaconnect.edu',
      password: 'password123',
      studentId: '011241012',
      department: 'Computer Science & Engineering',
      batch: 'Fall 2024',
      bio: 'First-year, still finding my way around campus.',
    },
    {
      name: 'Rakib Hasan',
      email: 'rakib.hasan@student.academiaconnect.edu',
      password: 'password123',
      studentId: '011231102',
      department: 'Computer Science & Engineering',
      batch: 'Spring 2023',
      bio: 'Photography club coordinator.',
    },
  ]);

  console.log('Users created.');

  // --- Courses -----------------------------------------------------------
  const courses = await Course.create([
    {
      title: 'Data Structures',
      code: 'CSE 2102',
      category: 'Data Structures',
      description:
        'Arrays, linked lists, stacks, queues, trees, and graphs, with an emphasis on choosing the right structure for the problem.',
      instructor: 'Dr. Farhana Islam',
      thumbnail: '',
      createdBy: admin._id,
      videos: [
        { title: 'Arrays & Linked Lists', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', duration: '18:24', order: 0 },
        { title: 'Stacks & Queues', url: 'https://www.youtube.com/watch?v=wjI1WNcIntg', duration: '22:10', order: 1 },
        { title: 'Binary Trees & Traversals', url: 'https://www.youtube.com/watch?v=fAAZixBzIAI', duration: '27:45', order: 2 },
      ],
      notes: [],
      enrolledStudents: [ayesha._id, tanvir._id, fahim._id],
    },
    {
      title: 'Artificial Intelligence',
      code: 'CSE 3811',
      category: 'Artificial Intelligence',
      description:
        'Search algorithms, knowledge representation, machine learning fundamentals, and an intro to neural networks.',
      instructor: 'Dr. Kamrul Hasan',
      thumbnail: '',
      createdBy: admin._id,
      videos: [
        { title: 'Uninformed & Informed Search', url: 'https://www.youtube.com/watch?v=WjS9c9tUB1I', duration: '31:02', order: 0 },
        { title: 'Intro to Neural Networks', url: 'https://www.youtube.com/watch?v=aircAruvnKk', duration: '19:13', order: 1 },
      ],
      notes: [],
      enrolledStudents: [ayesha._id, nusrat._id],
    },
    {
      title: 'Theory of Computation',
      code: 'CSE 3711',
      category: 'Theory of Computation',
      description: 'Finite automata, regular languages, context-free grammars, Turing machines, and decidability.',
      instructor: 'Dr. Farhana Islam',
      thumbnail: '',
      createdBy: admin._id,
      videos: [
        { title: 'Finite Automata (DFA/NFA)', url: 'https://www.youtube.com/watch?v=vhiiia1_hC4', duration: '24:50', order: 0 },
      ],
      notes: [],
      enrolledStudents: [tanvir._id],
    },
    {
      title: 'Database Systems',
      code: 'CSE 2213',
      category: 'Database Systems',
      description: 'Relational modeling, normalization, SQL, transactions, and indexing.',
      instructor: 'Dr. Shirin Akter',
      thumbnail: '',
      createdBy: admin._id,
      videos: [{ title: 'ER Modeling Basics', url: 'https://www.youtube.com/watch?v=QpdhBUYk7Kk', duration: '20:05', order: 0 }],
      notes: [],
      enrolledStudents: [fahim._id],
    },
    {
      title: 'Web Development',
      code: 'CSE 3161',
      category: 'Web Development',
      description: 'Full-stack fundamentals: HTML/CSS/JS, REST APIs, and databases, building toward a capstone project.',
      instructor: 'Rezaul Karim',
      thumbnail: '',
      createdBy: admin._id,
      videos: [],
      notes: [],
      enrolledStudents: [ayesha._id, tanvir._id, nusrat._id, fahim._id],
    },
  ]);
  console.log('Courses created.');

  // --- Clubs -----------------------------------------------------------
  const clubs = await Club.create([
    {
      name: 'Programming Club',
      category: 'Technical',
      description: 'Weekly problem-solving sessions, contest teams, and workshops on DSA and competitive programming.',
      members: [tanvir._id, ayesha._id, fahim._id],
      createdBy: admin._id,
      updates: [
        {
          title: 'Weekly contest this Friday',
          content: 'Div 2 style contest, 4 problems, 2 hours. Sign up on the club Discord by Thursday night.',
          postedBy: tanvir._id,
        },
      ],
    },
    {
      name: 'Photography Club',
      category: 'Cultural',
      description: 'Campus photo walks, an annual exhibition, and a lending library of gear for members.',
      members: [rakib._id, nusrat._id],
      createdBy: admin._id,
      updates: [
        {
          title: 'Photo walk at the botanical garden',
          content: 'Meeting at the main gate at 4pm Saturday. Bring your own camera or borrow one from the club locker.',
          postedBy: rakib._id,
        },
      ],
    },
    {
      name: 'Robotics Club',
      category: 'Technical',
      description: 'Line-followers, robo-soccer, and a yearly inter-university robotics competition team.',
      members: [nusrat._id],
      createdBy: admin._id,
      updates: [],
    },
    {
      name: 'Debate Club',
      category: 'Cultural',
      description: 'Parliamentary debate practice, inter-department tournaments, and public speaking workshops.',
      members: [],
      createdBy: admin._id,
      updates: [],
    },
  ]);
  console.log('Clubs created.');

  // --- Events -----------------------------------------------------------
  await Event.create([
    {
      title: 'Inter-Department Programming Contest',
      description: 'Annual contest between CSE, EEE, and CE departments. Teams of three, 5-hour format.',
      club: clubs[0]._id,
      date: daysFromNow(9),
      time: '10:00 AM',
      location: 'CS Building, Lab 4',
      organizer: 'Programming Club',
      attendees: [tanvir._id, ayesha._id],
      createdBy: admin._id,
    },
    {
      title: 'Campus Photo Walk',
      description: 'A relaxed evening photo walk around the lake and botanical garden.',
      club: clubs[1]._id,
      date: daysFromNow(3),
      time: '4:00 PM',
      location: 'Main Gate',
      organizer: 'Photography Club',
      attendees: [rakib._id, nusrat._id, fahim._id],
      createdBy: admin._id,
    },
    {
      title: 'RoboCon Qualifiers Info Session',
      description: 'Learn how the team qualifies for the national robotics competition and how to join.',
      club: clubs[2]._id,
      date: daysFromNow(14),
      time: '2:00 PM',
      location: 'EEE Seminar Room',
      organizer: 'Robotics Club',
      attendees: [],
      createdBy: admin._id,
    },
    {
      title: 'Freshers\' Welcome 2026',
      description: 'Orientation, club fair, and a welcome dinner for the newest batch of students.',
      club: null,
      date: daysFromNow(-5),
      time: '5:00 PM',
      location: 'Auditorium',
      organizer: 'Student Affairs',
      attendees: [ayesha._id, tanvir._id, nusrat._id, fahim._id, rakib._id],
      createdBy: admin._id,
    },
  ]);
  console.log('Events created.');

  // --- Notices -----------------------------------------------------------
  await Notice.create([
    {
      title: 'Mid-term Exam Routine Published',
      content:
        'The mid-term examination routine for all departments has been published on the registrar portal. Please check your individual schedule and report any clashes to your department office within 3 working days.',
      category: 'Exam',
      important: true,
      postedBy: admin._id,
    },
    {
      title: 'Semester Registration Deadline Extended',
      content:
        'Due to payment gateway issues last week, the registration deadline for the upcoming semester has been extended by 5 days. Late fees will not apply to registrations completed within this window.',
      category: 'Academic',
      important: true,
      postedBy: admin._id,
    },
    {
      title: 'Campus WiFi Maintenance',
      content:
        'Network maintenance is scheduled for this Sunday from 1 AM to 5 AM. WiFi access across all buildings, including the library and dormitories, will be intermittent during this window.',
      category: 'General',
      important: false,
      postedBy: admin._id,
    },
    {
      title: 'Winter Break Schedule',
      content:
        'The university will remain closed from December 20th through January 2nd. All administrative offices will reopen on January 3rd. Hall accommodation during the break requires prior approval from the provost office.',
      category: 'Holiday',
      important: false,
      postedBy: admin._id,
    },
  ]);
  console.log('Notices created.');

  // --- A couple of starter messages so the inbox isn't empty -----------------------------------------------------------
  const convo = await Conversation.create({
    participants: [ayesha._id, tanvir._id],
    lastMessage: 'See you at the contest prep session tomorrow!',
    lastMessageAt: new Date(),
  });
  await Message.create([
    { conversation: convo._id, sender: tanvir._id, content: 'Hey, are you joining the contest team this year?', read: true },
    { conversation: convo._id, sender: ayesha._id, content: 'Yeah! Been practicing DP problems all week.', read: true },
    { conversation: convo._id, sender: tanvir._id, content: 'See you at the contest prep session tomorrow!', read: false },
  ]);
  console.log('Sample conversation created.');

  console.log('\n=== Seed complete ===');
  console.log('Admin login  -> email: admin@academiaconnect.edu   password: admin123');
  console.log('Student login -> email: ayesha.rahman@student.academiaconnect.edu   password: password123');
  console.log('(All seeded students share the password: password123)\n');

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
