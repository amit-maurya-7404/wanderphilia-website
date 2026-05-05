# 🔄 OTP Login - Complete Flow Diagram

## User Journey Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LOGIN JOURNEY                        │
└─────────────────────────────────────────────────────────────────┘

                          START
                            │
                            ▼
                    ┌────────────────┐
                    │ Visit /login   │
                    └────────────────┘
                            │
                            ▼
                    ┌────────────────────┐
                    │ OTPLogin Component │
                    │  (Phone Stage)     │
                    └────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────────┐
            │ User Enters Phone Number          │
            │ (9876543210 or +919876543210)    │
            └───────────────────────────────────┘
                            │
                            ▼
                    ┌────────────────────┐
                    │ User Clicks        │
                    │ "Send OTP" Button  │
                    └────────────────────┘
                            │
                            ▼
            ┌─────────────────────────────────────┐
            │ Frontend: Validate Phone Format    │
            │ ├─ Remove non-digits              │
            │ ├─ Check 10 or 12 digits          │
            │ └─ Format to 91XXXXXXXXXX         │
            └─────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────────────────────────────────┐
        │ POST /api/send-otp                           │
        │ { phone: "919876543210" }                    │
        └──────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ Backend Process  │          │ OtpManager       │
    ├──────────────────┤          ├──────────────────┤
    │ 1. Validate      │          │ 1. Generate OTP  │
    │ 2. Format phone  │          │ 2. Store OTP     │
    │ 3. Generate OTP  │          │ 3. Set TTL       │
    │ 4. Store OTP     │          │    (10 min)      │
    │ 5. Send SMS      │          │ 4. Track attempts│
    └──────────────────┘          └──────────────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
        ┌──────────────────────────────────────┐
        │ MSG91 API: Send SMS                  │
        │ https://control.msg91.com/api/...   │
        └──────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
    ┌───────────────┐                ┌──────────────┐
    │ SUCCESS ✓     │                │ ERROR ✗      │
    │ SMS Sent      │                │ Show Error   │
    │ Response OK   │                │ Try Again    │
    └───────────────┘                └──────────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌──────────────────────────────┐
            │ Frontend: Show OTP Input     │
            │ Switch to "OTP Stage"        │
            │ Start 30-sec Resend Timer    │
            └──────────────────────────────┘
                            │
                            ▼
        ┌─────────────────────────────────────┐
        │ User Checks SMS & Receives OTP      │
        │ (e.g., "Your OTP is 123456")       │
        └─────────────────────────────────────┘
                            │
                            ▼
            ┌──────────────────────────────┐
            │ User Enters OTP in Component │
            │ (Input auto-formats to 6)    │
            └──────────────────────────────┘
                            │
                            ▼
                    ┌────────────────────┐
                    │ User Clicks        │
                    │ "Verify OTP"       │
                    └────────────────────┘
                            │
                            ▼
            ┌─────────────────────────────────────┐
            │ Frontend: Validate OTP              │
            │ ├─ Check not empty                │
            │ ├─ Check 6 digits                 │
            │ └─ Send to backend                │
            └─────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────────────────────────────┐
        │ POST /api/verify-otp                     │
        │ { phone: "919876543210", otp: "123456" }│
        └──────────────────────────────────────────┘
                            │
            ┌───────────────┴────────────────┐
            │                                │
            ▼                                ▼
    ┌────────────────────┐        ┌────────────────────┐
    │ Backend Verify     │        │ OtpManager         │
    ├────────────────────┤        ├────────────────────┤
    │ 1. Format phone    │        │ 1. Check OTP found │
    │ 2. Validate OTP    │        │ 2. Check not       │
    │ 3. Call OtpManager │        │    expired         │
    │ 4. Get result      │        │ 3. Check attempts  │
    │ 5. Generate token  │        │ 4. Compare OTP     │
    │ 6. Return token    │        │ 5. Clear OTP       │
    └────────────────────┘        └────────────────────┘
            │                                │
            └───────────────┬────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
    ┌────────────────┐            ┌────────────────┐
    │ VALID OTP ✓    │            │ INVALID OTP ✗  │
    │ Generate JWT   │            │ Increment      │
    │ Set Cookie     │            │ attempts       │
    │ Return Token   │            │ Show Error     │
    └────────────────┘            │ (Max 5)        │
            │                      └────────────────┘
            │                              │
            ▼                              ▼
    ┌──────────────────┐       ┌──────────────────┐
    │ Response:        │       │ Response:        │
    │ {                │       │ {                │
    │  success: true,  │       │  success: false, │
    │  message: "...", │       │  message: "..." │
    │  token: "eyJ..."│       │ }               │
    │ }               │       └──────────────────┘
    └──────────────────┘              │
            │                         ▼
            │               ┌─────────────────┐
            │               │ Show Error Msg  │
            │               │ Retry OTP       │
            │               └─────────────────┘
            │
            ▼
    ┌──────────────────────┐
    │ Frontend: Success    │
    │ ├─ Save token       │
    │ ├─ Save phone       │
    │ ├─ Save auth data   │
    │ └─ Show success msg │
    └──────────────────────┘
            │
            ▼
    ┌──────────────────────┐
    │ Auto-Redirect        │
    │ setTimeout(1000)     │
    │ router.push('/')     │
    └──────────────────────┘
            │
            ▼
        ┌────────┐
        │  HOME  │
        │ LOGGED │
        │  IN ✓  │
        └────────┘
```

---

## Component Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                       Next.js App                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                   Frontend (Client)                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────┐            │
│  │     Page: /login/page.tsx               │            │
│  │     ├─ Metadata                         │            │
│  │     └─ Renders OTPLogin Component       │            │
│  └─────────────────────────────────────────┘            │
│                      │                                   │
│                      ▼                                   │
│  ┌─────────────────────────────────────────┐            │
│  │ Component: OTPLogin                     │            │
│  │ ├─ Phone Input Stage                    │            │
│  │ ├─ OTP Input Stage                      │            │
│  │ ├─ State Management                     │            │
│  │ ├─ Phone Validation                     │            │
│  │ ├─ OTP Validation                       │            │
│  │ ├─ Resend Timer                         │            │
│  │ ├─ Loading States                       │            │
│  │ └─ Error/Success Messages               │            │
│  └─────────────────────────────────────────┘            │
│                      │                                   │
│      ┌───────────────┼───────────────┐                  │
│      │               │               │                  │
│      ▼               ▼               ▼                  │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐          │
│  │ useAuth  │  │AuthUtils │  │useRouter    │          │
│  │ Hook     │  │(Client)  │  │(Navigation) │          │
│  └──────────┘  └──────────┘  └─────────────┘          │
│                                                         │
│  Other Components:                                      │
│  ├─ AuthButton (navbar integration)                    │
│  └─ ProtectedRoute (route wrapping)                    │
│                                                         │
└──────────────────────────────────────────────────────────┘
                      │ fetch()
                      │
┌──────────────────────────────────────────────────────────┐
│                Backend (Server)                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────┐            │
│  │ Route: /api/send-otp/route.ts           │            │
│  │ POST Handler                            │            │
│  │ ├─ Validate Request                     │            │
│  │ ├─ Format Phone                         │            │
│  │ ├─ Generate OTP                         │            │
│  │ ├─ Store OTP (OtpManager)              │            │
│  │ ├─ Call MSG91 API                       │            │
│  │ └─ Return Response                      │            │
│  └─────────────────────────────────────────┘            │
│                      │                                   │
│  ┌─────────────────────────────────────────┐            │
│  │ Route: /api/verify-otp/route.ts         │            │
│  │ POST Handler                            │            │
│  │ ├─ Validate Request                     │            │
│  │ ├─ Format Phone                         │            │
│  │ ├─ Call OtpManager.verify()            │            │
│  │ ├─ Generate JWT Token                   │            │
│  │ ├─ Set HTTP-only Cookie                 │            │
│  │ └─ Return Response                      │            │
│  └─────────────────────────────────────────┘            │
│                      │                                   │
│      ┌───────────────┼───────────────┐                  │
│      │               │               │                  │
│      ▼               ▼               ▼                  │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐          │
│  │OtpManager│  │AuthUtils │  │MSG91 API    │          │
│  │(Server)  │  │          │  │(External)   │          │
│  │          │  │          │  │             │          │
│  │- store() │  │- getAuth │  │- Send SMS   │          │
│  │- verify()│  │- saveAuth│  │- Verify OTP │          │
│  │- clear() │  │- logout  │  │             │          │
│  │- exists()│  │          │  │             │          │
│  └──────────┘  └──────────┘  └─────────────┘          │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    DATA FLOW                             │
└──────────────────────────────────────────────────────────┘

PHONE SUBMISSION
┌────────────┐          ┌─────────┐          ┌─────────────┐
│ User Phone │─POST───▶ │Send OTP │─────────▶│ OtpManager  │
│ 9876543210 │          │ API     │          │ .store()    │
└────────────┘          └─────────┘          └─────────────┘
                              │                      │
                              ▼                      ▼
                        ┌──────────────┐     ┌───────────────┐
                        │ Generate OTP │     │ Store in Map  │
                        │ 123456       │     │ TTL: 10 min   │
                        └──────────────┘     └───────────────┘
                              │
                              ▼
                        ┌──────────────────────┐
                        │ MSG91 API: Send SMS  │
                        │ "+91 Your OTP: 123456│
                        └──────────────────────┘

OTP VERIFICATION
┌────────────┐          ┌──────────┐          ┌─────────────┐
│ User OTP   │─POST───▶ │Verify OTP│─────────▶│ OtpManager  │
│ 123456     │          │ API      │          │ .verify()   │
└────────────┘          └──────────┘          └─────────────┘
                              │                      │
                              ▼                      ▼
                        ┌──────────────┐     ┌───────────────┐
                        │ Match OTP    │     │ Check expiry  │
                        │ Check format │     │ Check attempts│
                        └──────────────┘     └───────────────┘
                              │
                              ▼
                        ┌──────────────────────┐
                        │ Generate JWT Token   │
                        │ Include phone & exp  │
                        │ 7-day validity       │
                        └──────────────────────┘
                              │
                              ▼
                        ┌──────────────────────┐
                        │ Set HTTP-only Cookie │
                        │ + Return in Response │
                        └──────────────────────┘
                              │
                              ▼
                        ┌──────────────────────┐
                        │ Frontend: Save       │
                        │ ├─ localStorage      │
                        │ ├─ auth_token        │
                        │ └─ user_phone        │
                        └──────────────────────┘
```

---

## Storage Diagram

```
┌────────────────────────────────────────────────────┐
│            WHERE DATA IS STORED                    │
└────────────────────────────────────────────────────┘

FRONTEND (Browser)
┌────────────────────────────┐
│     localStorage           │
├────────────────────────────┤
│ auth_token: "eyJ0..."     │ ◄─ JWT Token
│ user_phone: "919876..."   │ ◄─ User Phone
│ auth_data: "{...}"        │ ◄─ Full Auth Object
│                            │
│ Persists until:            │
│ ├─ Logout called           │
│ ├─ Token expires (7 days)  │
│ └─ Browser cleared         │
└────────────────────────────┘

BACKEND (Memory)
┌────────────────────────────────────────┐
│        OTP Store (In-Memory)           │
├────────────────────────────────────────┤
│ Map:                                   │
│ "919876543210" ──┐                    │
│                  └──▶ {               │
│                       otp: "123456",  │
│                       createdAt: ..., │
│                       attempts: 0     │
│                      }                │
│                                        │
│ Expiration:                            │
│ ├─ After 10 minutes: AUTO DELETE      │
│ └─ Cleanup runs every 5 minutes        │
└────────────────────────────────────────┘

EXTERNAL (MSG91)
┌────────────────────────────┐
│      SMS Sent              │
├────────────────────────────┤
│ Phone: +919876543210       │
│ Message: "Your OTP: 123456"│
│ Timestamp: ...             │
│ Status: Delivered/Pending  │
└────────────────────────────┘
```

---

## Security Diagram

```
┌────────────────────────────────────────────────────┐
│         SECURITY MEASURES IMPLEMENTED              │
└────────────────────────────────────────────────────┘

INPUT VALIDATION
┌────────────────────────┐
│  Frontend Validation   │
├────────────────────────┤
│ ✓ Phone format check   │
│ ✓ OTP format check     │
│ ✓ Empty field check    │
│ ✓ Max length enforce   │
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│  Backend Validation    │
├────────────────────────┤
│ ✓ Phone format check   │
│ ✓ OTP format check     │
│ ✓ Null/empty check     │
│ ✓ Type validation      │
└────────────────────────┘

PROTECTION LAYERS
┌─────────────────────────────────────────┐
│  API Key Protection                     │
├─────────────────────────────────────────┤
│ Server-Side Only: MSG91_AUTH_KEY        │
│ ├─ Not in frontend code                 │
│ ├─ Not in localStorage                  │
│ ├─ Not in network requests from browser │
│ └─ Only used by server                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Rate Limiting                          │
├─────────────────────────────────────────┤
│ OTP Max Attempts: 5                     │
│ After 5 failed attempts:                │
│ ├─ OTP is deleted                       │
│ ├─ User must request new OTP            │
│ └─ Error message shown                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Expiration                             │
├─────────────────────────────────────────┤
│ OTP Lifetime: 10 minutes                │
│ Auto-delete after expiration            │
│ Cleanup runs every 5 minutes            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Token Security                         │
├─────────────────────────────────────────┤
│ JWT Token:                              │
│ ├─ 7-day expiration                     │
│ ├─ Contains phone number                │
│ ├─ HTTP-only cookie capable             │
│ └─ Signed with server secret (prod)     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Error Handling                         │
├─────────────────────────────────────────┤
│ ✓ User-friendly messages                │
│ ✓ No sensitive data exposed             │
│ ✓ Proper HTTP status codes              │
│ ✓ Detailed server-side logging          │
└─────────────────────────────────────────┘
```

---

## Integration Points

```
YOUR EXISTING APP
└─ Navbar
   ├─ Add: import { AuthButton } from '@/components/auth-button'
   └─ Use:  <AuthButton />

└─ Protected Pages
   ├─ Add: import { ProtectedRoute } from '@/components/protected-route'
   └─ Use:  <ProtectedRoute> <YourContent /> </ProtectedRoute>

└─ Components
   ├─ Add: import { useAuth } from '@/hooks/use-auth'
   └─ Use:  const { isAuthenticated, phone } = useAuth()
```

---

**This diagram shows the complete architecture and flow of your OTP login system.**
