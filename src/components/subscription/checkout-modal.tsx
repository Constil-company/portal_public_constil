import { Backdrop, Box, Fade, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckoutPaymentStep from './checkout-payment-step';
import { CheckoutSession } from '../../models/checkout';

interface CheckoutModalProps {
  session?: CheckoutSession;
  open: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ session, open, onClose }: CheckoutModalProps) => {
  const handleClose = () => {
    onClose();
  };

  function getPlanName(planId: string): string {
    switch (planId) {
      case '1':
        return 'FREE TRIAL';
      case '2':
        return 'BASIC';
      case '3':
        return 'PROFESSIONAL';
      case '4':
        return 'ENTERPRISE';
      default:
        return 'UNKNOWN PLAN';
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}>
      <Fade in={open}>
        <Box className="fixed inset-0 flex items-center justify-center">
          <div className="flex bg-white rounded-lg shadow-md w-full max-w-[870px] relative overflow-hidden">
            <div className="flex flex-col justify-center w-1/2 bg-[#F5F5F5] px-12 py-12">
              <p className="text-base">
                Order Summary:
                <span className="text-lg text-[#448AFF] ml-3">
                  {session?.price} {session?.currency}
                </span>
                <span className="text-sm text-[#677582] ml-2">/ {session?.interval}</span>
              </p>

              <span className="text-base mt-8">
                BuePay ({session?.interval} - {getPlanName(session?.planId || '')})
              </span>

              <div className="border-y border-[#A3A4B2] my-4 py-3">
                <p className="flex items-center justify-between">
                  <span className="text-sm text-[#74758A]">Subtotal</span>
                  <span className="text-sm font-bold text-[#12153A] ml-2">
                    {session?.price} {session?.currency}
                  </span>
                </p>

                <p className="flex items-center justify-between mt-4">
                  <span className="text-sm text-[#74758A]">VAT</span>
                  <span className="text-sm font-bold text-[#12153A] ml-2">0 {session?.currency}</span>
                </p>
              </div>

              <p className="flex items-center justify-between">
                <span className="text-sm text-[#74758A]">Due Today</span>
                <span className="text-sm font-bold text-[#12153A] ml-2">
                  {session?.price} {session?.currency}
                </span>
              </p>
            </div>

            <div className="relative flex flex-col w-1/2 pt-12 pl-3">
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  color: '#12153A',
                }}>
                <CloseIcon />
              </IconButton>

              <div className="flex flex-col gap-2">
                <CheckoutPaymentStep clientSecret={session?.sessionId || ''} />
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CheckoutModal;
