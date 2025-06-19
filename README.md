# Amplify Gen 2 Auth Boilerplate

A clean, production-ready boilerplate for AWS Amplify Gen 2 applications with authentication, authorization, and multi-tier user management.

## Features

- 🔐 **Authentication**: Complete auth flow with Cognito (email + password)
- 👥 **User Management**: Multi-tier user system (basic, premium, admin)
- 🛡️ **Authorization**: Role-based access control
- 📱 **Responsive UI**: Modern React/Next.js with Material-UI
- 🎨 **Admin Dashboard**: User management interface
- 🔧 **TypeScript**: Full type safety
- 🚀 **Ready to Deploy**: Optimized for production
- 🌐 **Optional Social Login**: Google OAuth (configurable)
- 📁 **File Storage**: S3 bucket with secure access patterns

## Quick Start

1. **Install dependencies**
   ```bash
   yarn install
   cd amplify && yarn install && cd ..
   ```

2. **Start development sandbox**
   ```bash
   yarn sandbox
   ```

3. **Run the application**
   ```bash
   yarn dev
   ```

## Optional: Enable Google OAuth

By default, Google OAuth is disabled to make the boilerplate work out of the box. To enable it:

1. **Set up Google OAuth credentials** in Google Cloud Console
2. **Configure secrets** in your Amplify sandbox/deployment:
   ```bash
   yarn ampx sandbox secret set GOOGLE_CLIENT_ID
   yarn ampx sandbox secret set GOOGLE_CLIENT_SECRET
   ```
3. **Enable in frontend** by uncommenting the line in `app/constants/auth.ts`:
   ```typescript
   export const SUPPORTED_SOCIAL_PROVIDERS: string[] = [
     'Google', // Uncomment this line
   ];
   ```
4. **Update callback URLs** in `amplify/auth/resource.ts` with your production domain
5. **Redeploy** your sandbox/app

## Project Structure

```
├── amplify/           # Amplify backend configuration
│   ├── auth/         # Authentication resources
│   ├── data/         # Data layer and schemas
│   ├── functions/    # Lambda functions (auth triggers, user management)
│   └── storage/      # File storage (S3)
├── app/              # Next.js app router
│   ├── (admin)/     # Admin-only routes
│   ├── (main)/      # Main app routes  
│   ├── auth/        # Authentication pages
│   └── components/  # Reusable components
```

## User Tiers

- **Basic**: Standard user access (default)
- **Premium**: Enhanced features
- **Editor**: Content management capabilities
- **Admin**: Full system access including user management

## What's Included

### Backend Features
- **Authentication**: Cognito user pool with customized password policy
- **User Profiles**: Automatic profile creation with tier management
- **Storage**: S3 bucket with secure access patterns
- **Functions**: Pre/post auth triggers, user management APIs

### Frontend Features
- **Auth Pages**: Sign in, sign up, logout with proper error handling
- **Admin Panel**: User management with tier updates
- **Responsive Design**: Mobile-first approach with Material-UI
- **Protected Routes**: Automatic auth checking and redirects

### Security Features
- **Role-based Access**: Function-level and UI-level authorization
- **Secure Storage**: Proper S3 bucket policies
- **Input Validation**: Both frontend and backend validation
- **CSRF Protection**: Built into Amplify/Cognito

## Development

- `yarn dev` - Start development server
- `yarn sandbox` - Start Amplify sandbox
- `yarn build` - Build for production
- `yarn lint` - Run linting (both app and amplify)
- `yarn lint:app` - Lint frontend only
- `yarn lint:amplify` - Lint backend only

## Customization

This boilerplate is designed to be easily customizable:

1. **Change app name**: Replace "MyApp" throughout the codebase
2. **Add features**: Use the existing patterns for new functionality
3. **Modify user tiers**: Update the enum in `amplify/data/schemas/user-profile.ts`
4. **Add new pages**: Follow the existing route structure
5. **Style changes**: Modify the theme in `app/theme.ts`

## Deployment

This project is ready for deployment to AWS Amplify. The configuration supports:

- **Sandbox environments** for development
- **Branch-based deployments** for staging/production
- **Custom domains** and SSL certificates
- **Environment variables** and secrets management

## License

MIT
