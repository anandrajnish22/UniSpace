import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (in reverse dependency order to avoid foreign key errors)
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.communityMember.deleteMany();
  await prisma.community.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobSkill.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Default Passwords
  const defaultPassword = await bcrypt.hash('password123', 10);

  // 2. Create Skills
  console.log('Creating skills...');
  const skills = [
    { name: 'JavaScript', category: 'Programming' },
    { name: 'TypeScript', category: 'Programming' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Programming' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Figma', category: 'Design' },
    { name: 'Marketing', category: 'Business' },
  ];
  
  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  
  const allSkills = await prisma.skill.findMany();
  const reactSkill = allSkills.find(s => s.name === 'React');
  const nodeSkill = allSkills.find(s => s.name === 'Node.js');
  const uiuxSkill = allSkills.find(s => s.name === 'UI/UX Design');

  // 3. Create Users & Profiles
  console.log('Creating users...');
  const student1 = await prisma.user.create({
    data: {
      email: 'student@university.edu',
      name: 'Alex Johnson',
      passwordHash: defaultPassword,
      role: 'STUDENT',
      isEmailVerified: true,
      profile: {
        create: {
          bio: 'CS Junior passionate about full-stack development',
          university: 'State University',
          department: 'Computer Science',
          graduationYear: 2027,
          githubUrl: 'https://github.com/alexj',
        }
      },
      skills: {
        create: [
          { skillId: reactSkill!.id, proficiency: 'INTERMEDIATE' },
          { skillId: nodeSkill!.id, proficiency: 'BEGINNER' }
        ]
      }
    }
  });

  const companyUser = await prisma.user.create({
    data: {
      email: 'hr@techcorp.com',
      name: 'Sarah Smith',
      passwordHash: defaultPassword,
      role: 'COMPANY',
      isEmailVerified: true,
      company: {
        create: {
          name: 'TechCorp Innovations',
          description: 'Leading provider of software solutions.',
          website: 'https://techcorp.com',
          location: 'San Francisco, CA',
          industry: 'Technology',
          isVerified: true
        }
      }
    },
    include: { company: true }
  });

  // 4. Create Jobs
  console.log('Creating jobs...');
  await prisma.job.create({
    data: {
      companyId: companyUser.company!.id,
      title: 'Frontend Developer Intern',
      description: 'We are looking for a passionate React developer for our summer internship program.',
      location: 'Remote',
      type: 'INTERNSHIP',
      workMode: 'REMOTE',
      salaryMin: 15000,
      salaryMax: 25000,
      experience: '0-1 years',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      skills: {
        create: [
          { skillId: reactSkill!.id }
        ]
      }
    }
  });

  // 5. Create Marketplace Listings
  console.log('Creating marketplace listings...');
  await prisma.listing.create({
    data: {
      sellerId: student1.id,
      title: 'Calculus Early Transcendentals 8th Ed',
      description: 'Used textbook, good condition. Barely touched.',
      price: 1500,
      category: 'BOOKS',
      condition: 'GOOD',
      location: 'Main Campus Library',
      isNegotiable: true
    }
  });

  await prisma.listing.create({
    data: {
      sellerId: student1.id,
      title: 'Scientific Calculator Casio FX-991EX',
      description: 'Perfect for engineering students.',
      price: 800,
      category: 'ELECTRONICS',
      condition: 'LIKE_NEW',
      isNegotiable: false
    }
  });

  // 6. Create Communities
  console.log('Creating communities...');
  const community = await prisma.community.create({
    data: {
      name: 'Web Dev Club',
      description: 'A place for students to discuss web technologies, share projects, and learn together.',
      isPrivate: false,
      members: {
        create: [
          { userId: student1.id, role: 'ADMIN' }
        ]
      },
      posts: {
        create: [
          {
            userId: student1.id,
            title: 'Welcome to the Web Dev Club!',
            content: 'Feel free to introduce yourself and share what you are working on.',
            type: 'ANNOUNCEMENT'
          }
        ]
      }
    }
  });

  // 6. Create Events
  console.log('Creating events...');
  await prisma.event.create({
    data: {
      organizerId: student1.id,
      title: 'UniHack 2026 Hackathon',
      description: 'Annual 24-hour campus hackathon. Build amazing web and AI applications!',
      venue: 'Student Activity Center, Main Hall',
      date: new Date(Date.now() + 86400000 * 7), // 7 days from now
      category: 'HACKATHON',
      status: 'PUBLISHED',
      capacity: 100,
      ticketPrice: 0
    }
  });

  await prisma.event.create({
    data: {
      organizerId: student1.id,
      title: 'Full-Stack Web Dev Workshop',
      description: 'Learn modern React, TypeScript, and Express in this hands-on workshop.',
      venue: 'Computer Science Lab 3',
      date: new Date(Date.now() + 86400000 * 3), // 3 days from now
      category: 'WORKSHOP',
      status: 'PUBLISHED',
      capacity: 40,
      ticketPrice: 0
    }
  });

  console.log('✅ Seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Test Accounts:');
  console.log('Student: student@university.edu / password123');
  console.log('Company: hr@techcorp.com / password123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
