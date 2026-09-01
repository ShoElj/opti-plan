import { getUser, getUserProfile } from '@/lib/auth/helpers';
import { redirect } from 'next/navigation';
import AppClient from './AppClient';

import { getDashboardDataAction } from './actions';

export default async function AppPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const profile = await getUserProfile();
  
  const currencySymbolMap: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€',
  };
  
  const currencyCode = profile?.currency_code || 'NGN';
  const currencySymbol = currencySymbolMap[currencyCode] || '₦';

  const initialUser = {
    name: user.user_metadata?.full_name || 'Opti-Plan User',
    email: user.email || '',
    personaId: profile?.persona || 'salaried',
    currencyCode: currencyCode,
    currencySymbol: currencySymbol,
    subscriptionTier: 'free' as const, // We will fetch from product_subscriptions in Phase 9
  };

  const dashboardData = await getDashboardDataAction();

  return <AppClient initialUser={initialUser} dashboardData={dashboardData} />;
}
