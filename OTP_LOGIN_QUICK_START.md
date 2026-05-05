# OTP Login - Quick Start Guide

Get your OTP login system up and running in minutes!

## 📋 Checklist

- [x] API routes created (`/api/send-otp`, `/api/verify-otp`)
- [x] OTPLogin component created
- [x] Authentication utilities set up
- [x] Environment variables configured
- [ ] Test the login flow
- [ ] Integrate into your navbar
- [ ] Protect your routes (optional)

## 1️⃣ Test the Login Flow

### Step 1: Start your development server
```bash
npm run dev
```

### Step 2: Visit the login page
```
http://localhost:3000/login
```

### Step 3: Test with a phone number
- Enter: `9876543210`
- Click "Send OTP"
- Check browser console or server logs for the generated OTP
- Enter the OTP and click "Verify OTP"
- You should be redirected to home page

## 2️⃣ Integrate Auth Button into Navbar

Update your navbar component:

```tsx
// components/navbar.tsx or wherever your navbar is

import { AuthButton } from '@/components/auth-button';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <div className="text-xl font-bold">Wanderphilia</div>
      <div className="flex items-center gap-4">
        <a href="/">Home</a>
        <a href="/trips">Trips</a>
        <a href="/blog">Blog</a>
        
        {/* Add this */}
        <AuthButton />
      </div>
    </nav>
  );
}
```

## 3️⃣ Protect Routes (Optional)

Make certain pages only accessible to logged-in users.

### Example: Protect Booking Page

```tsx
// app/booking/page.tsx

import { ProtectedRoute } from '@/components/protected-route';

export default function BookingPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1>Booking Page</h1>
        {/* Your booking content */}
      </div>
    </ProtectedRoute>
  );
}
```

### Example: Protect Admin Page

```tsx
// app/admin/page.tsx

import { ProtectedRoute } from '@/components/protected-route';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1>Admin Dashboard</h1>
        {/* Your admin content */}
      </div>
    </ProtectedRoute>
  );
}
```

## 4️⃣ Access User Info in Components

Use the `useAuth` hook to access logged-in user info:

```tsx
'use client';

import { useAuth } from '@/hooks/use-auth';

export function UserProfile() {
  const { isAuthenticated, phone } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Logged in as: {phone}</p>
    </div>
  );
}
```

## 5️⃣ Send OTP Programmatically

Sometimes you might want to trigger login from somewhere else:

```tsx
'use client';

import { useRouter } from 'next/navigation';

export function BookNowButton() {
  const router = useRouter();

  const handleBooking = async () => {
    // Check if user is logged in (optional)
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    // Proceed with booking
    // ...
  };

  return (
    <button
      onClick={handleBooking}
      className="px-6 py-3 bg-blue-600 text-white rounded"
    >
      Book Now
    </button>
  );
}
```

## 6️⃣ Verify OTP from Backend

If you need to verify user on backend:

```ts
// lib/server-auth.ts

export async function verifyAuthToken(token: string) {
  try {
    // Decode token (use proper JWT library in production)
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check expiration
    if (payload.exp < Date.now()) {
      return null;
    }

    return { phone: payload.phone };
  } catch (error) {
    return null;
  }
}
```

Use in API route:

```ts
// app/api/booking/create/route.ts

import { verifyAuthToken } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = verifyAuthToken(token);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // Now you know the user is authenticated
  console.log('Booking for:', user.phone);

  // Your booking logic here
  return NextResponse.json({ success: true });
}
```

## 7️⃣ Customize Styling

The OTP login component uses Tailwind CSS. To customize:

### Change colors to match your brand

Open `/components/otp-login.tsx` and replace:
- `indigo-600` → your primary color
- `indigo-700` → your darker primary color
- `indigo-50` → your light primary color

### Change component size

```tsx
// From:
<div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">

// To:
<div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-lg">
```

## 🐛 Troubleshooting

### "OTP is undefined" error
- Check that `/lib/otp-manager.ts` exists
- Make sure API routes are using OtpManager

### Login button not showing
- Check that `useAuth` hook is properly imported
- Make sure component is marked with `'use client'`

### Redirect not working
- Verify `next/navigation` is imported
- Check that browser localStorage is not disabled

### SMS not received
- Verify MSG91 credentials are correct
- Check MSG91 account has SMS balance
- Verify phone number format (10 digits)

## 📚 File Reference

| File | Purpose |
|------|---------|
| `/app/api/send-otp/route.ts` | Backend: Send OTP |
| `/app/api/verify-otp/route.ts` | Backend: Verify OTP |
| `/components/otp-login.tsx` | Frontend: Login UI |
| `/components/auth-button.tsx` | Frontend: Auth button |
| `/components/protected-route.tsx` | Frontend: Route protection |
| `/lib/otp-manager.ts` | Backend: OTP storage |
| `/lib/auth-utils.ts` | Frontend: Auth utilities |
| `/hooks/use-auth.ts` | Frontend: useAuth hook |
| `/app/login/page.tsx` | Frontend: Login page |

## ✨ What's Next?

- [ ] Add user database to store phone numbers
- [ ] Create user profile page
- [ ] Add remember me functionality
- [ ] Implement WhatsApp OTP
- [ ] Add Google/social login
- [ ] Implement email verification
- [ ] Add two-factor authentication

---

**Need help?** Check `OTP_LOGIN_README.md` for detailed documentation.
