import React, { useState } from 'react';
import SubscriptionModal from '../subscription/subscription-modal';
import IconPlanolimiticon from '../../assets/icons/iconPlan'; // Ajuste o caminho conforme necessário
// import { CheckoutSession } from '../../models/checkout';
// import CheckoutModal from '../subscription/checkout-modal';

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CrownIcon = () => <IconPlanolimiticon />;

interface PlanLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  planName: string;
}

const PlanLimitModal: React.FC<PlanLimitModalProps> = ({ isOpen, onClose, planName }) => {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    setIsSubscriptionModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 items-center justify-center sm:p-8 w-[639px] h-[557px] text-center relative">
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 w-[26px] h-[26px] border border-gray-100 text-gray-400 hover:text-gray-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Fechar modal">
            <CloseIcon />
          </button>
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="flex justify-center items-center mb-6 mt-2 sm:mt-0">
              <div className="bg-yellow-50 rounded-full inline-flex w-[124px] h-[124px] items-center justify-center">
                <CrownIcon />
              </div>
            </div>
            <h2 className="text-[18px] sm:text-[18px] font-bold text-[#12153A] mb-3">
              You’ve reached your {planName} plan limit
            </h2>
            <p className="text-[#12153AAD] text-sm sm:text-base mb-8">
              You’re growing fast — and that’s a good thing! 🚀 <br />
              But your current plan can no longer keep up. <br /> Upgrade now to unlock more features and keep your{' '}
              <br /> momentum going without interruptions.
            </p>
            <button
              onClick={handleUpgradeClick}
              className="w-[205px] h-[42px] cursor-pointer font-light bg-[#448AFF] hover:bg-blue-600 text-white py-2 px-4 rounded-3xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 mx-auto">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      <SubscriptionModal open={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} />

      {/* <CheckoutModal
        session={selectedSession}
        open={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      /> */}
    </>
  );
};

export default PlanLimitModal;
