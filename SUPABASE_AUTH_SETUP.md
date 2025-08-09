# Supabase Authentication Setup Guide

This guide will help you set up Google and GitHub authentication using Supabase for your GPT-OSS Blog application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Google OAuth credentials
3. GitHub OAuth credentials

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Google OAuth

### 4.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Set **Application type** to "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
7. Copy the **Client ID** and **Client Secret**

### 4.2 Configure Google OAuth in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click **Configure**
3. Enable Google provider
4. Enter your Google **Client ID** and **Client Secret**
5. Save the configuration

## Step 5: Set Up GitHub OAuth

### 5.1 Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the application details:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000` (or your domain)
   - **Authorization callback URL**: `https://your-project-id.supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

### 5.2 Configure GitHub OAuth in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **GitHub** and click **Configure**
3. Enable GitHub provider
4. Enter your GitHub **Client ID** and **Client Secret**
5. Save the configuration

## Step 6: Configure Site URL

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Set **Site URL** to:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

## Step 7: Test the Authentication

1. Start your development server:
```bash
npm run dev
```

2. Open `http://localhost:3000`
3. Click the **Sign In** button in the navigation
4. Try logging in with Google or GitHub

## Features Included

- **Google OAuth Login**: Users can sign in with their Google account
- **GitHub OAuth Login**: Users can sign in with their GitHub account
- **User Avatar**: Displays user profile picture and name
- **Sign Out**: Users can sign out from their account
- **Auth State Management**: Persistent authentication state across page reloads
- **Error Handling**: Proper error messages for authentication failures
- **Toast Notifications**: User-friendly notifications for auth events

## Components Added

- `components/AuthProvider.tsx` - Authentication context provider
- `components/AuthLogin.tsx` - Login modal with Google/GitHub buttons
- `components/UserAvatar.tsx` - User profile display and logout
- `app/auth/callback/page.tsx` - OAuth callback handler
- `lib/supabase.ts` - Supabase client and auth helpers

## Troubleshooting

### Common Issues

1. **"Supabase is not configured" error**:
   - Make sure your `.env.local` file has the correct Supabase URL and key
   - Restart your development server after adding environment variables

2. **OAuth redirect errors**:
   - Check that your redirect URLs are correctly configured in both Google/GitHub and Supabase
   - Make sure the URLs match exactly (including http/https)

3. **"Invalid redirect URL" error**:
   - Verify the Site URL in Supabase matches your application URL
   - Check that redirect URLs are added to the allowed list

### Development vs Production

- For development, use `http://localhost:3000`
- For production, use your actual domain with HTTPS
- Update all OAuth providers and Supabase settings when deploying

## Security Notes

- Never commit your `.env.local` file to version control
- Use different Supabase projects for development and production
- Regularly rotate your OAuth client secrets
- Enable Row Level Security (RLS) in Supabase for additional protection

## Next Steps

Once authentication is working, you can:

1. Create user profiles table in Supabase
2. Implement user-specific chat history
3. Add role-based access control
4. Integrate with other Supabase features like real-time subscriptions

For more information, visit the [Supabase Documentation](https://supabase.com/docs/guides/auth).