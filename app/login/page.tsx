import OTPLogin from '@/components/otp-login';

export const metadata = {
  title: 'Login | Wanderphilia',
  description: 'Login to your Wanderphilia account',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <OTPLogin />;
}
