# Cambridge Past Paper Assistant

A comprehensive web application that helps Cambridge students (IGCSE, AS Level, A Level) find mark schemes for past paper questions instantly. Simply paste a question and get matching mark schemes from our extensive database.

## Features

### 🔍 Smart Search
- Advanced text similarity matching
- Keyword-based search optimization
- Subject filtering across all Cambridge subjects
- Instant results without manual PDF searching

### 👤 User Management
- Secure authentication with Supabase
- Free tier: 3 searches per day
- Premium tier: Unlimited searches
- Personal dashboard with analytics

### 📚 Comprehensive Database
- 30+ sample Cambridge questions across subjects:
  - Mathematics (IGCSE, AS, A Level)
  - Physics, Chemistry, Biology
  - Economics, Business Studies
  - Computer Science, and more
- Questions from 2015-2024
- Both May/June and Oct/Nov sessions

### 🎯 Student-Focused Features
- Search history tracking
- Bookmark favorite questions
- Mobile-responsive design
- Clean, intuitive interface
- Analytics dashboard

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- A Supabase account

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd cambridge-assistant
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key to `.env`

3. **Run database migrations**
   - The app will automatically create tables when you first connect
   - Sample data will be populated automatically

4. **Start development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Tables
- **questions**: Cambridge past paper questions with mark schemes
- **user_profiles**: User subscription and search limit tracking  
- **search_history**: User search history for analytics
- **bookmarks**: User's saved questions

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public read access to questions table

## Usage

### For Students
1. **Sign up** for a free account (3 searches/day)
2. **Paste a question** from your Cambridge assignment
3. **Select subject filter** if needed
4. **Get instant results** with matching mark schemes
5. **Bookmark** useful questions for later
6. **Track progress** in your personal dashboard

### Search Tips
- Include key mathematical symbols or scientific terms
- Use specific subject vocabulary
- Try different phrasings if no results found
- Use subject filters to narrow results

## Contributing

We welcome contributions! Here's how you can help:

### Adding New Questions
1. Questions should be authentic Cambridge past paper content
2. Include complete mark schemes with step-by-step solutions
3. Add relevant keywords for better search matching
4. Follow the existing format in the database

### Development
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Subscription Tiers

### Free Account
- 3 searches per day
- Full access to question database
- Search history and bookmarks
- Mobile-responsive interface

### Premium Account (Coming Soon)
- Unlimited searches
- Priority support
- Advanced analytics
- Early access to new features

## Support

- **Issues**: Report bugs via GitHub issues
- **Feature Requests**: Submit via GitHub discussions
- **Contact**: Use the in-app contact form

## Legal Notice

This application is not affiliated with Cambridge Assessment International Education. It is an independent tool created to help students study more effectively. All past paper content is used for educational purposes under fair use guidelines.

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ for Cambridge students worldwide**