# Lavi Hospital Vaccination Management System

A comprehensive vaccination management system built with Next.js and Supabase for educational purposes. This system manages patient registrations, vaccination records, appointments, and staff administration.

## 🎯 Project Overview

This is a final-year project demonstrating a complete healthcare management system with the following features:

- **Patient Management**: Registration, profile management, vaccination records
- **Staff Management**: Doctor/vaccinator accounts and administration
- **Appointment System**: Scheduling and management of vaccination appointments
- **Inventory Management**: Vaccine stock tracking and management
- **Admin Dashboard**: Complete oversight of the system
- **Role-Based Access**: Different interfaces for patients, doctors, and administrators

## 🏗️ System Architecture

- **Frontend**: Next.js 13+ with App Router, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time subscriptions)
- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase account** (free tier available)
- A modern web browser

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd lavi-hospital-vaccination-system
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 3: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be set up (usually takes 2-3 minutes)
4. Go to **Settings** → **API** in your Supabase dashboard
5. Copy your **Project URL** and **anon public key**

### Step 4: Configure Environment Variables

1. Copy the example environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Open \`.env.local\` and fill in your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   \`\`\`

### Step 5: Set Up the Database

The database schema will be automatically created when you first run the application. The system includes:

- **patients** table for patient information
- **vaccinators** table for medical staff
- **appointments** table for scheduling
- **vaccination_records** table for tracking vaccinations
- **vaccines** table for inventory management

### Step 6: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

\`\`\`
lavi-hospital-vaccination-system/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard pages
│   ├── doctor/                   # Doctor/vaccinator pages
│   ├── patient/                  # Patient portal pages
│   ├── api/                      # API routes
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── ui/                       # UI component library
│   └── forms/                    # Form components
├── lib/                          # Utility libraries
├── services/                     # API service functions
├── types/                        # TypeScript type definitions
├── utils/                        # Helper functions
└── public/                       # Static assets
\`\`\`

## 🔐 User Roles and Access

### Patient Portal (\`/patient\`)
- Register and manage personal profile
- View vaccination history
- Schedule appointments
- Update contact information

### Doctor/Vaccinator Portal (\`/doctor\`)
- Manage patient appointments
- Administer vaccinations
- View patient records
- Update vaccination status

### Admin Dashboard (\`/admin\`)
- Manage all users (patients and staff)
- Inventory management
- System reports and analytics
- Staff management

## 🎨 Design System

The application uses a consistent design system with:

- **Colors**: Custom color palette with primary, secondary, and accent colors
- **Typography**: Consistent font sizes and weights
- **Components**: Reusable UI components built with Radix UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔧 Development Commands

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Format code
npm run format
\`\`\`

## 📊 Database Schema Overview

### Core Tables:
- **patients**: Patient information and medical history
- **vaccinators**: Medical staff and their specializations
- **appointments**: Vaccination appointments and scheduling
- **vaccination_records**: Complete vaccination history
- **vaccines**: Vaccine inventory and information

## 🐛 Troubleshooting

### Common Issues:

1. **Supabase Connection Error**
   - Verify your environment variables are correct
   - Check if your Supabase project is active
   - Ensure you're using the correct API keys

2. **Build Errors**
   - Run \`npm install\` to ensure all dependencies are installed
   - Check for TypeScript errors with \`npm run type-check\`

3. **Authentication Issues**
   - Verify Supabase authentication is enabled
   - Check if email confirmation is required

### Getting Help:
- Check the browser console for error messages
- Review the Supabase dashboard for database issues
- Ensure all environment variables are properly set

## 📚 Learning Resources

This project demonstrates several key concepts:

- **Next.js App Router**: Modern React framework with server-side rendering
- **Supabase Integration**: Backend-as-a-Service with PostgreSQL
- **TypeScript**: Type-safe JavaScript development
- **Form Handling**: React Hook Form with validation
- **Authentication**: User management and role-based access
- **Database Design**: Relational database schema design
- **API Development**: RESTful API endpoints

## 🎓 Educational Value

This project serves as an excellent learning tool for:

- Full-stack web development
- Healthcare system design
- Database management
- User authentication and authorization
- Modern React patterns
- TypeScript development
- API design and implementation

## 📝 License

This project is created for educational purposes. Feel free to use it for learning and academic projects.

## 🤝 Contributing

This is an educational project. If you're using it for learning:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with a clear description

## 📞 Support

For educational support or questions about this project:

- Review the documentation above
- Check the troubleshooting section
- Examine the code comments for implementation details
- Test individual components to understand functionality

---

**Note**: This system is designed for educational purposes and should not be used in production healthcare environments without proper security audits and compliance reviews.
