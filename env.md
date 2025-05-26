 =============================================================================
# LAVI HOSPITAL VACCINATION SYSTEM - ENVIRONMENT VARIABLES
# =============================================================================
# 
# This file contains all the environment variables needed to run the 
# vaccination management system locally. Copy this file to .env.local 
# and fill in your actual values.
#
# IMPORTANT: Never commit .env.local to version control!
# =============================================================================

# -----------------------------------------------------------------------------
# SUPABASE CONFIGURATION
# -----------------------------------------------------------------------------
# These are the core database and authentication settings for your Supabase project.
# You can find these values in your Supabase dashboard under Settings > API.

# Your Supabase project URL
# Example: https://abcdefghijklmnop.supabase.co
# Where to find: Supabase Dashboard > Settings > API > Project URL
NEXT_PUBLIC_SUPABASE_URL=https://ozhhcvjnwdntywypwdaw.supabase.co

# Supabase anonymous/public key (safe to expose in frontend)
# This key allows public access to your database based on your RLS policies
# Where to find: Supabase Dashboard > Settings > API > Project API keys > anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aGhjdmpud2RudHl3eXB3ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Njk2MTYsImV4cCI6MjA2MDI0NTYxNn0.Vza2Z7Jj3qW0-PFk5xWPBuRCOXbLiLUjL4dTW_FQEG4

# Supabase service role key (KEEP SECRET - server-side only)
# This key has full access to your database, bypassing RLS policies
# Where to find: Supabase Dashboard > Settings > API > Project API keys > service_role
# WARNING: This key should NEVER be exposed to the frontend!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aGhjdmpud2RudHl3eXB3ZGF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2OTYxNiwiZXhwIjoyMDYwMjQ1NjE2fQ.R-fIchZn7cNHA2uswxzOfwhXQGbWFAJh3oFq3EDg_Nk

# Alternative Supabase URL format (some configurations may need this)
# Usually the same as NEXT_PUBLIC_SUPABASE_URL
SUPABASE_URL=https://ozhhcvjnwdntywypwdaw.supabase.co

# -----------------------------------------------------------------------------
# APPLICATION CONFIGURATION
# -----------------------------------------------------------------------------

# The base URL of your application (for local development)
# This is used for redirects and email links
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Debug mode for development (shows additional logging)
# Set to 'true' for development, 'false' for production
NEXT_PUBLIC_DEBUG_MODE=true

# Logging level for the application
# Options: 'debug', 'info', 'warn', 'error'
NEXT_PUBLIC_LOG_LEVEL=debug

# -----------------------------------------------------------------------------
# DATABASE CONFIGURATION (Auto-configured by Supabase)
# -----------------------------------------------------------------------------
# These are automatically provided by Supabase but may be needed for some integrations

# PostgreSQL connection string (provided by Supabase)
# Where to find: Supabase Dashboard > Settings > Database > Connection string
POSTGRES_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ozhhcvjnwdntywypwdaw.supabase.co:5432/postgres

# Prisma-compatible PostgreSQL URL (if using Prisma ORM)
POSTGRES_PRISMA_URL=your_postgres_prisma_url_here

# Non-pooling PostgreSQL URL (for migrations and admin tasks)
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url_here

# Individual PostgreSQL connection parameters
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=your_postgres_host
POSTGRES_DATABASE=postgres

# -----------------------------------------------------------------------------
# AUTHENTICATION CONFIGURATION
# -----------------------------------------------------------------------------

# JWT secret for Supabase authentication (provided by Supabase)
# Where to find: Supabase Dashboard > Settings > API > JWT Settings
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Supabase anonymous key (duplicate for compatibility)
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# =============================================================================
# SETUP INSTRUCTIONS
# =============================================================================
#
# 1. CREATE SUPABASE PROJECT:
#    - Go to https://supabase.com
#    - Sign up for a free account
#    - Click "New Project"
#    - Choose your organization
#    - Enter project name: "lavi-hospital-system"
#    - Enter database password (save this!)
#    - Select region closest to you
#    - Click "Create new project"
#    - Wait 2-3 minutes for setup to complete
#
# 2. GET YOUR CREDENTIALS:
#    - In Supabase dashboard, go to Settings > API
#    - Copy "Project URL" to NEXT_PUBLIC_SUPABASE_URL
#    - Copy "anon public" key to NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - Copy "service_role" key to SUPABASE_SERVICE_ROLE_KEY
#
# 3. COPY THIS FILE:
#    - Copy this file to .env.local
#    - Replace all "your_*_here" values with actual credentials
#    - Save the file
#
# 4. VERIFY SETUP:
#    - Run: npm run dev
#    - Open: http://localhost:3000
#    - Try registering a new patient account
#
# =============================================================================
# SECURITY NOTES
# =============================================================================
#
# - NEVER commit .env.local to git
# - The service role key has full database access - keep it secret
# - Only the NEXT_PUBLIC_* variables are safe to expose to browsers
# - Use different credentials for development and production
# - Regularly rotate your service role key in production
#
# =============================================================================
# TROUBLESHOOTING
# =============================================================================
#
# If you get connection errors:
# 1. Check that your Supabase project is active (not paused)
# 2. Verify all URLs and keys are copied correctly
# 3. Ensure no extra spaces or quotes in the values
# 4. Check Supabase dashboard for any service issues
#
# If authentication fails:
# 1. Verify the anon key is correct
# 2. Check if email confirmation is required in Supabase Auth settings
# 3. Look at browser network tab for specific error messages
#
# =============================================================================
