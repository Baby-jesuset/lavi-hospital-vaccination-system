# Lavi Hospital Vaccination Management System

<<<<<<< HEAD
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
=======
A comprehensive full-stack web application for managing vaccination appointments, patient records, and healthcare administration built with Next.js, TypeScript, and Supabase.

## 🏥 Overview

The Lavi Hospital Vaccination Management System is designed to streamline vaccination processes in healthcare facilities. It provides role-based access for administrators, doctors, and patients, enabling efficient appointment scheduling, patient management, and vaccination tracking.

## ✨ Features

### 👨‍💼 Admin Features
- **Dashboard**: Overview of system metrics and recent activities
- **Vaccinator Management**: Add, edit, and manage healthcare staff
- **Inventory Management**: Track vaccine stock levels and expiration dates
- **Scheduling Management**: Oversee all appointments and schedules
- **Patient Oversight**: Monitor patient registrations and records
- **Reports**: Generate comprehensive system reports

### 👨‍⚕️ Doctor/Vaccinator Features
- **Appointment Management**: View and manage assigned appointments
- **Vaccination Administration**: Record administered vaccines
- **Patient Records**: Access patient medical histories and records

### 👤 Patient Features
- **Appointment Scheduling**: Book vaccination appointments
- **Vaccination Records**: View personal vaccination history
- **Account Management**: Update personal information and preferences

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context + Custom Hooks
- **Notifications**: Custom Toast System
>>>>>>> 595bee3463104cee9216762a786993bc50791b83

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
<<<<<<< HEAD
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
=======
- **Supabase account** for database and authentication

## 🚀 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/Baby-jesuset/lavi-hospital-vaccination-system.git
cd lavi-hospital-vaccination-system 

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Configuration

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URLs (provided by Supabase)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
POSTGRES_HOST=your_postgres_host

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
\`\`\`

### 4. Database Setup

#### 4.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Copy the project URL and anon key to your \`.env.local\`

#### 4.2 Run Database Migrations

Execute the following SQL in your Supabase SQL editor:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(50),
    street TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vaccinators table
CREATE TABLE vaccinators (
    vaccinator_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id UUID REFERENCES departments(id),
    specialization TEXT,
    credentials TEXT,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    available_monday BOOLEAN DEFAULT true,
    available_tuesday BOOLEAN DEFAULT true,
    available_wednesday BOOLEAN DEFAULT true,
    available_thursday BOOLEAN DEFAULT true,
    available_friday BOOLEAN DEFAULT true,
    available_saturday BOOLEAN DEFAULT false,
    available_sunday BOOLEAN DEFAULT false,
    work_hours_start TIME DEFAULT '09:00',
    work_hours_end TIME DEFAULT '17:00',
    max_daily_appointments INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
    appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    vaccinator_id UUID REFERENCES vaccinators(vaccinator_id) ON DELETE SET NULL,
    purpose TEXT NOT NULL,
    description TEXT,
    date_of_visit DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    notify_by_email BOOLEAN DEFAULT true,
    notify_by_sms BOOLEAN DEFAULT false,
    notify_by_whatsapp BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'scheduled',
    billing_status VARCHAR(50) DEFAULT 'not_applicable',
    insurance_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample department
INSERT INTO departments (name, description) VALUES 
('General Medicine', 'General medical services and vaccinations');

-- Create indexes for better performance
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_vaccinators_email ON vaccinators(email);
CREATE INDEX idx_vaccinators_user_id ON vaccinators(user_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_vaccinator_id ON appointments(vaccinator_id);
CREATE INDEX idx_appointments_date ON appointments(date_of_visit);
\`\`\`

#### 4.3 Set Up Row Level Security (RLS)

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Patients can only see their own data
CREATE POLICY "Patients can view own data" ON patients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Patients can update own data" ON patients
    FOR UPDATE USING (auth.uid() = user_id);

-- Vaccinators can see their own data and appointments
CREATE POLICY "Vaccinators can view own data" ON vaccinators
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Vaccinators can view appointments" ON appointments
    FOR SELECT USING (
        vaccinator_id IN (
            SELECT vaccinator_id FROM vaccinators WHERE user_id = auth.uid()
        )
    );

-- Add more policies as needed for your security requirements
\`\`\`

### 5. Development Server

Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication Setup

### Default User Roles

The system supports three user roles:

1. **Admin**: Full system access
2. **Doctor/Vaccinator**: Medical staff access
3. **Patient**: Patient portal access

### Creating Test Users

1. **Patient Registration**: Use the \`/register\` page
2. **Staff Accounts**: Create through Supabase Auth dashboard and manually add to respective tables

## 📱 Usage Instructions

### For Patients

1. **Registration**:
   - Visit \`/register\`
   - Fill in personal information
   - Verify email address
   - Complete profile setup

2. **Booking Appointments**:
   - Navigate to "Appointment Scheduling"
   - Select preferred date and time
   - Choose available vaccinator
   - Confirm appointment details

3. **Managing Records**:
   - View vaccination history in "Vaccination Records"
   - Update personal information in "Account Management"

### For Healthcare Staff

1. **Appointment Management**:
   - View assigned appointments in dashboard
   - Update appointment status
   - Add notes and observations

2. **Patient Records**:
   - Access patient medical histories
   - Record vaccination administration
   - Update patient information

### For Administrators

1. **Staff Management**:
   - Add new vaccinators
   - Manage staff schedules
   - Monitor staff performance

2. **System Oversight**:
   - View system-wide metrics
   - Generate reports
   - Manage inventory levels

## 🧪 Testing

### Running Tests

\`\`\`bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

### Test Data

Use the provided seed scripts to populate test data:

\`\`\`bash
npm run seed:dev
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**:
   - Import project to Vercel
   - Connect your GitHub repository

2. **Environment Variables**:
   - Add all environment variables from \`.env.local\`
   - Ensure production Supabase credentials

3. **Deploy**:
   - Vercel will automatically deploy on push to main branch

### Manual Deployment

\`\`\`bash
# Build the application
npm run build

# Start production server
npm run start
\`\`\`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Supabase project URL | Yes |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anonymous key | Yes |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Supabase service role key | Yes |
| \`NEXT_PUBLIC_APP_URL\` | Application base URL | Yes |
| \`NEXT_PUBLIC_DEBUG_MODE\` | Enable debug mode | No |

### Customization

#### Styling
- Modify \`tailwind.config.js\` for theme customization
- Update \`app/globals.css\` for global styles
- Customize shadcn/ui components in \`components/ui/\`

#### Features
- Add new user roles in \`types/db.ts\`
- Extend database schema as needed
- Implement additional API endpoints in \`app/api/\`

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure RLS policies are correctly configured

2. **Authentication Issues**:
   - Verify Supabase Auth configuration
   - Check email verification settings
   - Ensure proper redirect URLs

3. **Build Errors**:
   - Clear \`.next\` directory: \`rm -rf .next\`
   - Reinstall dependencies: \`rm -rf node_modules && npm install\`
   - Check TypeScript errors: \`npm run type-check\`

### Getting Help

- Check the [Issues](https://github.com/Baby-jesuset/lavi-hospital-vaccination-system/issues) page
- Review Supabase documentation
- Contact the development team

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/new-feature\`
3. Commit changes: \`git commit -am 'Add new feature'\`
4. Push to branch: \`git push origin feature/new-feature\`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components

## 📞 Support

For support and questions:
- Email: support@lavihospital.com
- Documentation: [Project Wiki](https://github.com/Baby-jesuset/lavi-hospital-vaccination-system/wiki)
- Issues: [GitHub Issues](https://github.com/Baby-jesuset/lavi-hospital-vaccination-system/issues)

---

**Note**: This is an academic project developed for educational purposes. For production use in healthcare environments, ensure compliance with relevant regulations (HIPAA, GDPR, etc.) and conduct thorough security audits.
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
