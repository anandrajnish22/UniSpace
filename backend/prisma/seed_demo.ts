import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding comprehensive Demo Student Showcase data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Ensure Skills exist
  const skillNames = [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Programming' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Programming' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Data Structures', category: 'Computer Science' },
    { name: 'SQL', category: 'Database' },
  ];

  for (const s of skillNames) {
    await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  const allSkills = await prisma.skill.findMany();
  const reactSkill = allSkills.find(s => s.name === 'React');
  const tsSkill = allSkills.find(s => s.name === 'TypeScript');
  const nodeSkill = allSkills.find(s => s.name === 'Node.js');
  const pythonSkill = allSkills.find(s => s.name === 'Python');
  const dsaSkill = allSkills.find(s => s.name === 'Data Structures');

  // 2. Peer students (for interactions: buying, selling, chatting)
  const priya = await prisma.user.upsert({
    where: { email: 'priya.singh@university.edu' },
    update: {},
    create: {
      email: 'priya.singh@university.edu',
      name: 'Priya Singh',
      passwordHash,
      role: 'STUDENT',
      isEmailVerified: true,
      profile: {
        create: {
          bio: 'Electronics & Comm Junior | IoT Enthusiast',
          university: 'State University',
          department: 'Electronics & Communication',
          course: 'B.Tech ECE',
          graduationYear: 2027,
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        },
      },
    },
  });

  const amit = await prisma.user.upsert({
    where: { email: 'amit.patel@university.edu' },
    update: {},
    create: {
      email: 'amit.patel@university.edu',
      name: 'Amit Patel',
      passwordHash,
      role: 'STUDENT',
      isEmailVerified: true,
      profile: {
        create: {
          bio: 'Mechanical Engg 2nd Year | Searching for accommodation near North Campus',
          university: 'State University',
          department: 'Mechanical Engineering',
          course: 'B.Tech ME',
          graduationYear: 2028,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        },
      },
    },
  });

  // 3. Main Showcase Demo Student (demo@unispace.edu)
  // Delete existing demo user if present to get fresh clean showcase state
  const existingDemo = await prisma.user.findUnique({ where: { email: 'demo@unispace.edu' } });
  if (existingDemo) {
    await prisma.user.delete({ where: { id: existingDemo.id } });
  }

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@unispace.edu',
      name: 'Rahul Sharma',
      passwordHash,
      role: 'STUDENT',
      isEmailVerified: true,
      profile: {
        create: {
          bio: 'Computer Science & Engg (3rd Year) | Full-Stack Developer & Open Source Contributor | Tech Lead @ Campus Web Club',
          university: 'State University of Technology',
          department: 'Computer Science & Engineering',
          course: 'B.Tech CSE',
          graduationYear: 2027,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          githubUrl: 'https://github.com/rahul-sharma-demo',
          linkedinUrl: 'https://linkedin.com/in/rahul-sharma-demo',
          portfolioUrl: 'https://rahulsharma.dev',
        },
      },
    },
  });

  console.log(`Created Showcase User: ${demoUser.name} (${demoUser.email})`);

  // Link skills to Rahul
  if (reactSkill) await prisma.userSkill.create({ data: { userId: demoUser.id, skillId: reactSkill.id, proficiency: 'EXPERT' } });
  if (tsSkill) await prisma.userSkill.create({ data: { userId: demoUser.id, skillId: tsSkill.id, proficiency: 'INTERMEDIATE' } });
  if (nodeSkill) await prisma.userSkill.create({ data: { userId: demoUser.id, skillId: nodeSkill.id, proficiency: 'INTERMEDIATE' } });
  if (pythonSkill) await prisma.userSkill.create({ data: { userId: demoUser.id, skillId: pythonSkill.id, proficiency: 'INTERMEDIATE' } });

  // 4. MARKETPLACE: Rahul selling items + receiving offers + making offer
  console.log('Seeding Marketplace...');
  const listing1 = await prisma.listing.create({
    data: {
      sellerId: demoUser.id,
      title: 'Calculus Early Transcendentals (8th Ed) - James Stewart',
      description: 'Used for Semester 1 & 2. Clean pages, no scribbles. Essential for engineering mathematics and exams.',
      price: 650,
      category: 'BOOKS',
      condition: 'LIKE_NEW',
      location: 'Central Library / North Hostel',
      isNegotiable: true,
      status: 'ACTIVE',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', order: 0 }
        ]
      }
    }
  });

  const listing2 = await prisma.listing.create({
    data: {
      sellerId: demoUser.id,
      title: 'Ergonomic 360° Rotatable Aluminum Laptop Stand',
      description: 'Sturdy metal laptop stand, adjustable height, heat dissipation vents. Selling because upgraded to a dual-monitor arm.',
      price: 499,
      category: 'ACCESSORIES',
      condition: 'LIKE_NEW',
      location: 'Hostel Block B, Room 204',
      isNegotiable: true,
      status: 'ACTIVE',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80', order: 0 }
        ]
      }
    }
  });

  const listing3 = await prisma.listing.create({
    data: {
      sellerId: demoUser.id,
      title: 'Firefox 21-Speed Mountain Gear Bicycle (Dual Disc Brakes)',
      description: 'Well-maintained campus bicycle with front suspension, mudguards, and cable lock included. Smooth shifting.',
      price: 3600,
      category: 'CYCLES',
      condition: 'GOOD',
      location: 'Campus Cycle Stand 4',
      isNegotiable: true,
      status: 'ACTIVE',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', order: 0 }
        ]
      }
    }
  });

  // Offers received on Rahul's listings
  await prisma.offer.create({
    data: {
      listingId: listing2.id,
      buyerId: priya.id,
      amount: 450,
      message: 'Hi Rahul! Can I take this laptop stand for ₹450 today evening from Hostel B?',
      status: 'PENDING',
    }
  });

  await prisma.offer.create({
    data: {
      listingId: listing1.id,
      buyerId: amit.id,
      amount: 550,
      message: 'Will pay 550 cash right away at Central Library.',
      status: 'PENDING',
    }
  });

  // Another student listing where Rahul made an offer
  const priyaListing = await prisma.listing.create({
    data: {
      sellerId: priya.id,
      title: 'Casio Scientific Calculator FX-991CW (Latest Edition)',
      description: 'Natural textbook display, matrix/vector/equation solver. Ideal for mid-terms and finals.',
      price: 900,
      category: 'ELECTRONICS',
      condition: 'LIKE_NEW',
      location: 'ECE Department Block',
      isNegotiable: true,
      status: 'ACTIVE',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80', order: 0 }
        ]
      }
    }
  });

  await prisma.offer.create({
    data: {
      listingId: priyaListing.id,
      buyerId: demoUser.id,
      amount: 800,
      message: 'Hey Priya, would you take ₹800? Can collect tomorrow around 2 PM.',
      status: 'PENDING',
    }
  });

  // 5. ROOMMATES (UniRoom)
  console.log('Seeding Roommates & Housing...');
  await prisma.roomListing.create({
    data: {
      listerId: demoUser.id,
      type: 'ROOMMATE',
      location: 'Greenwood Apartments, North Campus Road (Opposite Gate 2)',
      rentAmount: 6500,
      depositAmount: 10000,
      availableFrom: new Date(),
      description: 'Spacious private bedroom in a 2BHK flat. High-speed 300 Mbps Wi-Fi, split AC, geyser, refrigerator, semi-modular kitchen, power backup, and dedicated bike parking. Very peaceful environment for studying.',
      genderPref: 'ANY',
      amenities: JSON.stringify(['High-Speed WiFi', 'Split AC', 'Geyser', 'Washing Machine', 'Refrigerator', 'Power Backup', '2-Wheeler Parking', 'RO Water']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=600&q=80']),
      status: 'AVAILABLE',
    }
  });

  // Another room listing by Amit
  await prisma.roomListing.create({
    data: {
      listerId: amit.id,
      type: 'PG',
      location: 'Sunlight PG for Boys, University Enclave',
      rentAmount: 5500,
      depositAmount: 5500,
      availableFrom: new Date(),
      description: 'Double sharing room with 3 meals daily (North & South Indian food). 24/7 water supply, daily housekeeping included.',
      genderPref: 'MALE',
      amenities: JSON.stringify(['3 Meals Daily', 'Housekeeping', 'WiFi', 'CCTV Security', 'Laundry']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80']),
      status: 'AVAILABLE',
    }
  });

  // Roommate Preferences for Rahul
  await prisma.roommatePreference.create({
    data: {
      userId: demoUser.id,
      budgetMin: 5000,
      budgetMax: 8000,
      locations: JSON.stringify(['North Campus', 'Model Town', 'Hudson Lane', 'University Enclave']),
      lifestyle: 'NIGHT_OWL',
      foodPref: 'ANY',
      moveInDate: new Date(),
    }
  });

  // 6. STUDY HUB: Notes, Question Papers, and Study Groups
  console.log('Seeding Study Hub...');
  await prisma.studyResource.create({
    data: {
      uploaderId: demoUser.id,
      title: 'Data Structures & Algorithms - Complete Handwritten Notes (Unit 1 to 5)',
      description: 'Comprehensive handwritten lecture notes covering Trees, Graphs, Heaps, Dynamic Programming, and Time Complexity. Includes solved code snippets and diagrams.',
      subject: 'Data Structures & Algorithms',
      course: 'CS301',
      semester: 'Semester 5',
      university: 'State University of Technology',
      type: 'NOTE',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: 'application/pdf',
      downloads: 148,
    }
  });

  await prisma.studyResource.create({
    data: {
      uploaderId: demoUser.id,
      title: 'Database Management Systems (DBMS) - Solved End-Term Papers (2021-2025)',
      description: 'Previous 5 years university end-semester questions with detailed solutions: ER modeling, SQL Queries, Normalization (1NF to BCNF), and ACID transactions.',
      subject: 'Database Systems',
      course: 'CS304',
      semester: 'Semester 5',
      university: 'State University of Technology',
      type: 'PREVIOUS_PAPER',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: 'application/pdf',
      downloads: 94,
    }
  });

  await prisma.studyResource.create({
    data: {
      uploaderId: demoUser.id,
      title: 'Computer Networks - OSI & TCP/IP Model Quick Revision Architecture Sheet',
      description: 'High-yield exam revision sheet: Subnetting shortcuts, HTTP vs HTTPS, TCP 3-way handshake, Routing algorithms (Dijkstra, Bellman-Ford).',
      subject: 'Computer Networks',
      course: 'CS402',
      semester: 'Semester 6',
      university: 'State University of Technology',
      type: 'TUTORIAL',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: 'application/pdf',
      downloads: 72,
    }
  });

  // Study Groups
  const group1 = await prisma.studyGroup.create({
    data: {
      name: 'DSA & LeetCode Daily Problem Solving',
      description: 'Daily grind of NeetCode 150 & LeetCode medium questions. Discussing optimal approaches and time complexity.',
      subject: 'Data Structures & Algorithms',
      isPrivate: false,
      members: {
        create: [
          { userId: demoUser.id, role: 'ADMIN' },
          { userId: priya.id, role: 'MEMBER' },
          { userId: amit.id, role: 'MEMBER' },
        ]
      }
    }
  });

  const group2 = await prisma.studyGroup.create({
    data: {
      name: 'GATE CSE 2027 Study Circle',
      description: 'Collaborative group solving Standard PYQs, Theory of Computation, OS, and Discrete Mathematics for GATE.',
      subject: 'Computer Science',
      isPrivate: false,
      members: {
        create: [
          { userId: demoUser.id, role: 'MEMBER' },
          { userId: priya.id, role: 'ADMIN' },
        ]
      }
    }
  });

  // 7. JOBS & INTERNSHIPS (Applications & Opportunities)
  console.log('Seeding Jobs & Applications...');
  let company = await prisma.company.findFirst();
  if (!company) {
    const hrUser = await prisma.user.findUnique({ where: { email: 'hr@techcorp.com' } });
    if (hrUser) {
      company = await prisma.company.create({
        data: {
          userId: hrUser.id,
          name: 'TechCorp Innovations',
          description: 'Next-gen enterprise software and AI platform engineering company.',
          website: 'https://techcorp.com',
          location: 'Bangalore / Remote',
          industry: 'Software & Technology',
          isVerified: true,
        }
      });
    }
  }

  if (company) {
    const job1 = await prisma.job.create({
      data: {
        companyId: company.id,
        title: 'Frontend Developer Intern (React & TypeScript)',
        description: 'Join our core platform engineering team to build scalable Web3 and modern dashboard features. Mentorship provided by senior architects.',
        location: 'Remote',
        type: 'INTERNSHIP',
        workMode: 'REMOTE',
        salaryMin: 25000,
        salaryMax: 35000,
        currency: 'INR',
        experience: '0-1 years',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
      }
    });

    const job2 = await prisma.job.create({
      data: {
        companyId: company.id,
        title: 'Full-Stack Software Engineer (Campus 2026/2027)',
        description: 'Building distributed APIs in Node.js/Go, microservices, and React frontends. Excellent performance bonuses and stock options.',
        location: 'Bangalore / Hybrid',
        type: 'FULL_TIME',
        workMode: 'HYBRID',
        salaryMin: 800000,
        salaryMax: 1200000,
        currency: 'INR',
        experience: 'Fresher',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      }
    });

    // Rahul's Application to Job 1 (Status: SHORTLISTED)
    await prisma.jobApplication.create({
      data: {
        jobId: job1.id,
        userId: demoUser.id,
        resumeUrl: 'https://unispace-storage.demo/resumes/rahul-sharma-cse.pdf',
        coverLetter: 'I have hands-on production experience building React applications with TypeScript and REST/GraphQL APIs. I am passionate about developer tooling and maintain open-source campus projects.',
        status: 'SHORTLISTED',
      }
    });
  }

  // 8. COMMUNITIES & CAMPUS CLUBS
  console.log('Seeding Communities...');
  const webClub = await prisma.community.upsert({
    where: { name: 'Campus Web Developers Club' },
    update: {},
    create: {
      name: 'Campus Web Developers Club',
      description: 'Official student community for frontend, backend, full-stack, and open-source software builders.',
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
      isPrivate: false,
    }
  });

  await prisma.communityMember.upsert({
    where: { communityId_userId: { communityId: webClub.id, userId: demoUser.id } },
    update: {},
    create: {
      communityId: webClub.id,
      userId: demoUser.id,
      role: 'ADMIN',
    }
  });

  const post = await prisma.post.create({
    data: {
      communityId: webClub.id,
      userId: demoUser.id,
      title: '🚀 Hands-on Workshop: Building Full-Stack Apps with React & Node.js',
      content: 'Hey everyone! This Thursday at 4 PM in CS Lab 2, we are hosting a beginner-friendly code-along session. Bring your laptops! Snacks & drinks will be provided.',
      type: 'ANNOUNCEMENT',
    }
  });

  await prisma.comment.create({
    data: {
      postId: post.id,
      userId: priya.id,
      content: 'Super excited for this! Will you also cover Docker and database basics?',
    }
  });

  await prisma.comment.create({
    data: {
      postId: post.id,
      userId: amit.id,
      content: 'Count me in! Already RSVP’d on the portal.',
    }
  });

  // 9. EVENTS & HACKATHONS
  console.log('Seeding Events...');
  const hackathon = await prisma.event.create({
    data: {
      organizerId: demoUser.id,
      title: 'UniHack 2026: 36-Hour National Campus Hackathon',
      description: 'Premier inter-college hackathon with ₹1,00,000+ prize pool. Tracks include AI/ML, Web3, FinTech, and Smart Campus Solutions.',
      bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      venue: 'Main Auditorium & Student Innovation Center',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      startTime: '09:00 AM',
      endTime: '06:00 PM',
      capacity: 250,
      ticketPrice: 0,
      category: 'HACKATHON',
      status: 'PUBLISHED',
    }
  });

  // Rahul Registration to Hackathon
  await prisma.eventRegistration.create({
    data: {
      eventId: hackathon.id,
      userId: demoUser.id,
      qrCode: 'UNIHACK-2026-RAHUL-SHARMA',
      status: 'CONFIRMED',
    }
  });

  // 10. DIRECT MESSAGES / CONVERSATIONS
  console.log('Seeding Direct Conversations & Messages...');
  // Conversation 1: Rahul & Priya (Discussing book & study)
  const conv1 = await prisma.conversation.create({
    data: {
      type: 'DIRECT',
      members: {
        create: [
          { userId: demoUser.id },
          { userId: priya.id },
        ]
      }
    }
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: priya.id,
      content: 'Hey Rahul! Is the Calculus textbook still available?',
    }
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: demoUser.id,
      content: 'Yes Priya, it is available! Are you free to collect it from Central Library tomorrow around 4 PM?',
    }
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: priya.id,
      content: 'Perfect, 4 PM works great for me. Thanks!',
    }
  });

  // Conversation 2: Rahul & Amit (Roommate Inquiry)
  const conv2 = await prisma.conversation.create({
    data: {
      type: 'DIRECT',
      members: {
        create: [
          { userId: demoUser.id },
          { userId: amit.id },
        ]
      }
    }
  });

  await prisma.message.create({
    data: {
      conversationId: conv2.id,
      senderId: amit.id,
      content: 'Hi Rahul, I saw your 2BHK flat listing in Greenwood Apartments. Is the single room still vacant?',
    }
  });

  await prisma.message.create({
    data: {
      conversationId: conv2.id,
      senderId: demoUser.id,
      content: 'Hi Amit! Yes, it is vacant and ready to move in. You can come visit and inspect the place this Saturday.',
    }
  });

  // 11. NOTIFICATIONS
  console.log('Seeding Notifications...');
  const notifications = [
    {
      userId: demoUser.id,
      type: 'SUCCESS',
      title: '🎉 Application Shortlisted!',
      content: 'TechCorp Innovations has shortlisted your application for Frontend Developer Intern (React & TypeScript).',
      link: '/jobs',
      isRead: false,
    },
    {
      userId: demoUser.id,
      type: 'INFO',
      title: '💬 New Offer on Laptop Stand',
      content: 'Priya Singh made an offer of ₹450 on your listing "Ergonomic 360° Rotatable Aluminum Laptop Stand".',
      link: '/marketplace',
      isRead: false,
    },
    {
      userId: demoUser.id,
      type: 'INFO',
      title: '🏠 Roommate Inquiry Received',
      content: 'Amit Patel sent an inquiry regarding your room listing in Greenwood Apartments.',
      link: '/roommates',
      isRead: false,
    },
    {
      userId: demoUser.id,
      type: 'SUCCESS',
      title: '🔥 100+ Downloads Milestone!',
      content: 'Your study resource "Data Structures & Algorithms - Complete Handwritten Notes" reached 148 downloads!',
      link: '/study',
      isRead: true,
    },
    {
      userId: demoUser.id,
      type: 'INFO',
      title: '📅 Registration Confirmed',
      content: 'Your ticket for UniHack 2026: 36-Hour National Campus Hackathon is confirmed. QR Code generated.',
      link: '/events',
      isRead: true,
    },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }

  console.log('🎉 SHOWCASE DEMO DATA SEEDED SUCCESSFULLY!');
  console.log('===========================================================');
  console.log('Showcase Student Account:');
  console.log('  Email:    demo@unispace.edu');
  console.log('  Password: password123');
  console.log('  Name:     Rahul Sharma (3rd Year CSE)');
  console.log('===========================================================');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
