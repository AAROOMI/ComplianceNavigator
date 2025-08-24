# ComplianceNavigator - Vercel Deployment Guide

## 📋 Complete Step-by-Step Deployment Guide

### Phase 1: Download Your Project from Replit

1. **Download Project Files**
   - In Replit, click the three dots (⋯) in the file explorer
   - Select "Download as zip"
   - Extract the zip file on your computer
   - You'll have a folder with all your project files

### Phase 2: Required File Modifications

2. **Update package.json Scripts**
   Open `package.json` and replace the scripts section with:
   ```json
   "scripts": {
     "dev": "tsx server/index.ts",
     "build": "node build-vercel.js",
     "build:frontend": "vite build", 
     "build:backend": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=api/index.js",
     "start": "NODE_ENV=production node dist/index.js",
     "check": "tsc",
     "db:push": "drizzle-kit push"
   }
   ```

3. **Verify Required Files Are Present**
   ✅ `vercel.json` (already created)
   ✅ `api/index.ts` (already created)
   ✅ `build-vercel.js` (already created)
   ✅ All source code folders: `client/`, `server/`, `shared/`
   ✅ `attached_assets/` folder with images
   ✅ Configuration files: `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`

### Phase 3: Database Setup

4. **Choose Database Provider**

   **Option A: Neon (Recommended)**
   - Go to https://neon.tech
   - Sign up for free account
   - Click "Create Project"
   - Choose region closest to your users
   - Copy the connection string (starts with `postgresql://`)

   **Option B: Vercel Postgres**
   - Create Vercel account first
   - In project dashboard → Storage → Create Database → Postgres
   - Copy connection details

### Phase 4: Upload to GitHub

5. **Create GitHub Repository**
   - Go to https://github.com
   - Click "New repository"
   - Name it (e.g., "compliance-navigator")
   - Make it public or private
   - Don't initialize with README

6. **Upload Your Files**
   - Download GitHub Desktop or use command line
   - Upload ALL project files including:
     - All source code folders
     - Configuration files
     - `attached_assets/` folder
     - The new Vercel files I created

### Phase 5: Deploy to Vercel

7. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up (use GitHub account for easier integration)
   - Verify your email

8. **Import Your Project**
   - Click "New Project"
   - Import from GitHub
   - Select your compliance-navigator repository
   - Configure deployment settings:
     - **Framework Preset**: Other
     - **Root Directory**: `.` (leave empty)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist/public`
     - **Install Command**: `npm install`

### Phase 6: Configure Environment Variables

9. **Set Environment Variables in Vercel**
   - In your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add each variable for Production, Preview, and Development:

   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=generate_32_character_random_string
   PGDATABASE=your_database_name
   PGHOST=your_database_host
   PGPASSWORD=your_database_password
   PGPORT=5432
   PGUSER=your_database_username
   NODE_ENV=production
   ```

10. **Generate SESSION_SECRET**
    Use this command or online generator:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```

### Phase 7: Deploy and Test

11. **Deploy Application**
    - Click "Deploy" in Vercel
    - Wait for build to complete (usually 2-5 minutes)
    - You'll get a live URL like `your-app.vercel.app`

12. **Test Your Application**
    - Visit your live URL
    - Test login/logout functionality
    - Verify all pages load correctly
    - Check database connections work

### Phase 8: Custom Domain (Optional)

13. **Add Custom Domain**
    - In Vercel project → Settings → Domains
    - Add your domain (e.g., `compliance.yourdomain.com`)
    - Follow DNS configuration instructions
    - Wait for DNS propagation (up to 48 hours)

## 🔧 Troubleshooting

### Common Issues and Solutions

**Build Fails**
- Check Node.js version is 18.x in Vercel settings
- Verify all dependencies are in package.json
- Check build logs for specific errors

**Database Connection Errors**
- Verify DATABASE_URL format: `postgresql://user:password@host:port/database`
- Check database is accessible from internet
- Ensure all PGXXXX environment variables are set

**Static Files Not Loading**
- Verify `attached_assets/` folder was uploaded
- Check file paths in your code use correct references
- Ensure assets are in the build output directory

**API Routes Return 404**
- Verify `api/index.ts` exports your Express app correctly
- Check `vercel.json` rewrites configuration
- Ensure server routes are properly defined

**Login/Session Issues**
- Check SESSION_SECRET is set and same across all environments
- Verify session configuration in your Express app
- Ensure database session table exists

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Test database connection separately

## 🎉 Success!

Once deployed, your ComplianceNavigator will be:
- Accessible at your Vercel URL
- Automatically scaled and optimized
- Backed up and monitored by Vercel
- Ready for your custom domain

Your cybersecurity compliance platform is now live and ready to help organizations achieve NCA ECC compliance!