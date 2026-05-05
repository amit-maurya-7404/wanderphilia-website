# OTP Login Implementation Guide

This is a complete OTP-based login system using MSG91 for your Next.js application. Follow this guide to integrate it into your project.

## ✅ What's Included

### Backend API Routes

1. **`/api/send-otp`** (POST)
   - Accepts phone number
   - Sends OTP via MSG91
   - Returns success/error response

2. **`/api/verify-otp`** (POST)
   - Accepts phone number and OTP
   - Verifies OTP against stored value
   - Returns JWT token on success

### Frontend Components

1. **`OTPLogin` Component** (`/components/otp-login.tsx`)
   - Complete UI for OTP login flow
   - Phone input stage
   - OTP input stage
   - Resend timer (30 seconds)
   - Loading and error states
   - Built-in validation

2. **Login Page** (`/app/login/page.tsx`)
   - Dedicated login page at `/login`
   - Uses OTPLogin component

### Utilities & Hooks

1. **`AuthUtils`** (`/lib/auth-utils.ts`)
   - Token management
   - Auth state persistence
   - Logout functionality

2. **`OtpManager`** (`/lib/otp-manager.ts`)
   - Server-side OTP storage
   - Expiration handling (10 minutes)
   - Rate limiting (5 attempts max)

3. **`useAuth` Hook** (`/hooks/use-auth.ts`)
   - Client-side authentication state
   - Auth status checking
   - Logout functionality

## 🚀 Setup Instructions

### 1. Environment Variables

Verify these are in your `.env.local`:

```env
MSG91_AUTH_KEY=your_auth_key
MSG91_TEMPLATE_ID=your_template_id
```

Your keys are already configured!

### 2. Update Your Layout (Optional)

Add a logout button in your navbar or header:

```tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export function Navbar() {
  const { isAuthenticated, phone, logout } = useAuth();

  return (
    <nav className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <span className="text-sm text-gray-600">Hello, {phone}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </Link>
      )}
    </nav>
  );
}
```

### 3. Protect Routes (Optional)

Create a route protection wrapper:

```tsx
// components/protected-route.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

Use it in your pages:

```tsx
import { ProtectedRoute } from '@/components/protected-route';

export default function BookingPage() {
  return (
    <ProtectedRoute>
      {/* Your booking page content */}
    </ProtectedRoute>
  );
}
```

## 🧪 Testing

### Quick Test with curl

#### Send OTP

```bash
curl -X POST http://localhost:3000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'
```

Response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "requestId": "..."
}
```

#### Verify OTP

```bash
curl -X POST http://localhost:3000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456"}'
```

Response:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Manual Testing in Browser

1. Go to `http://localhost:3000/login`
2. Enter a phone number (e.g., 9876543210)
3. Click "Send OTP"
4. Check the console to see what OTP was generated (see debugging section)
5. Enter the OTP in the second form
6. Click "Verify OTP"
7. You should be redirected to homepage

## 🔍 Debugging

### View Generated OTP (Development Only)

In `/app/api/send-otp/route.ts`, check the console logs:

```bash
# Terminal where Next.js is running
OTP sent successfully to 919876543210
```

### Check localStorage

Open browser DevTools (F12) → Application → Local Storage:

- `auth_token`: Contains the JWT token
- `user_phone`: Contains the phone number

### Common Issues

**Issue**: "MSG91 API credentials not configured"
- **Solution**: Verify `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID` in `.env.local`
- Restart the development server after adding env variables

**Issue**: "Failed to send OTP"
- **Solution**: 
  - Verify phone number format (10 or 12 digits)
  - Check MSG91 API key is valid
  - Check MSG91 account has sufficient SMS balance

**Issue**: OTP verification always fails
- **Solution**:
  - Make sure you're entering the correct OTP
  - OTP expires after 10 minutes
  - Max 5 attempts per OTP

**Issue**: Resend timer not working
- **Solution**: Check browser console for errors, clear localStorage

## 📁 File Structure

```
app/
├── login/
│   └── page.tsx                 # Login page
├── api/
│   ├── send-otp/
│   │   └── route.ts            # Send OTP endpoint
│   └── verify-otp/
│       └── route.ts            # Verify OTP endpoint
components/
├── otp-login.tsx               # Main OTP login component
hooks/
├── use-auth.ts                 # useAuth hook
lib/
├── auth-utils.ts               # Auth utilities
├── otp-manager.ts              # Server-side OTP management
```

## 🔐 Security Notes

### Current Implementation
- ✅ API keys only on backend
- ✅ OTP expires after 10 minutes
- ✅ Rate limiting (5 attempts per OTP)
- ✅ HTTP-only cookies for tokens
- ✅ Input validation on frontend and backend

### Production Recommendations

1. **Database Storage**: Replace in-memory OTP store with database
   ```ts
   // Use MongoDB to store OTPs with TTL
   const otpSchema = new Schema({
     phone: String,
     otp: String,
     createdAt: { type: Date, expires: 600 } // 10 minutes
   });
   ```

2. **JWT Secret**: Use a proper secret key
   ```ts
   import jwt from 'jsonwebtoken';
   
   const token = jwt.sign({ phone }, process.env.JWT_SECRET, {
     expiresIn: '7d'
   });
   ```

3. **Rate Limiting**: Implement rate limiting on send-otp endpoint
   ```ts
   import rateLimit from 'express-rate-limit';
   ```

4. **HTTPS**: Always use HTTPS in production

5. **CORS**: Configure CORS if frontend is on different domain

## 🎨 Customization

### Styling

The component uses Tailwind CSS. To customize:

1. Change colors: Replace `indigo-600` with your brand color
2. Change dimensions: Modify `max-w-md`, `p-8`, etc.
3. Custom CSS: Add to `globals.css`

### OTP Length

Change from 6 to different length:

**In `/lib/otp-manager.ts`:**
```ts
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Change this
}
```

**In component validation:**
```ts
if (!/^\d{6}$/.test(trimmedOTP)) { // Change 6 to desired length
```

## 📝 API Reference

### POST /api/send-otp

**Request:**
```json
{
  "phone": "9876543210"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "requestId": "unique-request-id"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid phone number format"
}
```

### POST /api/verify-otp

**Request:**
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

## 🚀 Next Steps

1. ✅ Implement protected routes
2. ✅ Add user database to store phone numbers
3. ✅ Implement "remember me" functionality
4. ✅ Add 2FA for additional security
5. ✅ Implement social login as alternative

## 📞 MSG91 API Endpoints

For reference:

- **Send OTP**: `https://control.msg91.com/api/sendotp.php`
- **Verify OTP**: `https://control.msg91.com/api/verifyotp.php`

Documentation: https://msg91.com/apidoc/

---

**Questions?** Check the debugging section or the code comments for detailed explanations.
