# Calorie Tracker

A modern, full-featured calorie tracking application built with Next.js, Supabase, and TypeScript. Track your daily calories, set fasting goals, and monitor your progress with beautiful visualizations.

## ✨ Features

### 📊 Calorie Tracking
- **Daily Calorie Logging**: Track calories consumed and set daily targets
- **Weekly Overview**: Visual progress tracking with charts
- **Goal Management**: Set and track weekly calorie goals
- **Progress Analytics**: Monitor your calorie intake patterns

### ⏰ Intermittent Fasting
- **Fasting Presets**: Choose from popular fasting methods (16:8, 18:6, 20:4, 24h, 36h)
- **Custom Presets**: Create and save your own fasting schedules
- **Auto-Calculation**: Automatic start/end time calculation based on current time
- **Circular Progress Tracker**: Beautiful progress visualization with fasting milestones
- **Fasting Phases**: Track different phases (fat burning, autophagy, etc.) with icons

### 📱 Mobile-First Design
- **Bottom Tab Navigation**: Native mobile navigation experience
- **Floating Action Button**: Quick access to common actions
- **Theme-Aware Colors**: Tab colors adapt to selected theme
- **Responsive Design**: Optimized for all screen sizes
- **Clean Mobile Header**: Streamlined interface without desktop clutter

### 🎨 Theming & Customization
- **Multiple Themes**: Default, Ocean, Forest, Sunset, Purple, Dark
- **Dynamic Colors**: All components adapt to selected theme
- **Consistent Design**: Unified color scheme across all features
- **Accessibility**: Proper contrast ratios maintained

### 🔐 User Management
- **Secure Authentication**: Powered by Supabase Auth
- **Data Privacy**: Row-level security for all user data
- **Profile Management**: User settings and preferences
- **Data Deletion**: Granular control over data removal

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Netlify account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/freymirodc/calorie-tracker.git
   cd calorie-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   Run the migrations in the `supabase/migrations/` directory:
   - `001_initial_schema.sql` - Core tables and RLS policies
   - `002_fasting_presets.sql` - Fasting presets functionality

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Features

### Bottom Tab Navigation
- **Dashboard**: Main overview and quick stats
- **Calendar**: Daily calorie entries (placeholder)
- **Stats**: Analytics and progress tracking (placeholder)
- **Profile**: User settings and theme selection

### Floating Action Button
- **Log Calories**: Quick calorie entry
- **Start Fast**: Select fasting preset with auto-calculated times
- **Quick Log**: Fast calorie logging with defaults

### Fasting Progress Tracker
- **Circular Progress**: Visual representation of fasting progress
- **Milestone Markers**: Important fasting phases with icons
- **Real-time Updates**: Live progress tracking
- **Phase Information**: Detailed descriptions of each fasting phase

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Deployment**: Netlify

## 🚀 Deployment

### Netlify Setup

1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Netlify will automatically detect the build settings

2. **Configure Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node.js version: `18`

### GitHub Actions

The project includes automated CI/CD with GitHub Actions:

- **On Pull Requests**: Deploy preview to Netlify
- **On Push to Main**: Create release and deploy to production
- **Semantic Versioning**: Automatic version bumping based on commit messages

## 📝 Commit Message Convention

Use conventional commits for automatic versioning:

```bash
# Feature (minor version bump)
git commit -m "feat: add circular fasting progress tracker"

# Bug fix (patch version bump)
git commit -m "fix: resolve FAB positioning issue on mobile"

# Breaking change (major version bump)
git commit -m "feat!: redesign authentication system

BREAKING CHANGE: authentication API has changed"
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── calories/          # Calorie tracking components
│   ├── fasting/           # Fasting-related components
│   ├── mobile/            # Mobile-specific components
│   ├── settings/          # Settings and preferences
│   ├── theme/             # Theme management
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
└── supabase/              # Database migrations
```

## 🔧 Configuration

### Themes
Themes are configured in `src/lib/theme-provider.tsx` with CSS custom properties for consistent styling across all components.

### Database
All database schemas and RLS policies are defined in the `supabase/migrations/` directory.

### Netlify
Configuration is handled by `netlify.toml` with optimized build settings and redirects for SPA behavior.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and Netlify
