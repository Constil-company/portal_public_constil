import type { ReactNode } from 'react';
import logoImg from '../../assets/logo/CONSTIL.svg';
import Carousel from '../../components/carrocel/carrocel';

type AuthPageLayoutProps = {
  children: ReactNode;
  compact?: boolean;
};

export function AuthPageLayout({ children, compact = false }: AuthPageLayoutProps) {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
        <div className="flex flex-col bg-white w-full h-full min-h-0">
          <header className={`shrink-0 px-8 ${compact ? 'pt-4 pb-2' : 'pt-6 pb-3'}`}>
            <img
              onClick={() => window.open('http://constil.com/')}
              src={logoImg}
              alt="Logo"
              className="h-3.5 w-28 cursor-pointer object-contain object-left"
            />
          </header>

          <div className="flex-1 min-h-0 overflow-y-auto px-8">
            <div
              className={`flex min-h-full items-center justify-center ${compact ? 'py-4' : 'py-6'}`}
            >
              <div className="w-full max-w-[400px]">{children}</div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex img_backgrounds items-center justify-center w-full h-full img_backgrouns relative p-2">
          <Carousel />
        </div>
      </div>
    </div>
  );
}

/** Altura fixa 2.75rem (44px) — ver .auth-input em style.css */
export const AUTH_INPUT_CLASS = 'auth-input';

export const AUTH_INPUT_ICON_CLASS = 'auth-input auth-input--with-icon';

export const AUTH_LABEL_CLASS = 'auth-label';

export const AUTH_OTP_DIGIT_CLASS = 'auth-otp-digit';

export function AuthDivider({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div className={`relative ${compact ? 'my-3' : 'my-5'}`}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-4 text-[#88939D]">{label}</span>
      </div>
    </div>
  );
}

export function AuthPageHeader({
  title,
  subtitle,
  compact = false,
}: {
  title: string;
  subtitle: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'mb-3' : 'mb-6'}>
      <h1 className={`font-semibold text-[#12153A] ${compact ? 'text-xl' : 'text-2xl'}`}>{title}</h1>
      <p className={`text-[#88939D] leading-snug ${compact ? 'mt-1 text-xs' : 'mt-2 text-sm leading-relaxed'}`}>
        {subtitle}
      </p>
    </div>
  );
}
