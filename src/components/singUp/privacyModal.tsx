import { Backdrop, Box, Fade, Modal } from "@mui/material";
import PrivacyAndPolicy from "../../utils/privacy-and-policy";

interface PrivacyModalProps {
    open: boolean;
    onClose: () => void;
}

const PrivacyModal = ({ open, onClose }: PrivacyModalProps) => {

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            }}>
            <Fade in={open}>
                <Box className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-md w-full max-w-[870px] relative overflow-hidden">
                        <div className="flex p-7 text-[#12153A] text-xl font-bold">
                            <span>
                                Privacy Policy
                            </span>
                        </div>

                        <div className="flex flex-col px-6 pb-6 max-h-96 overflow-hidden overflow-y-auto">
                            <PrivacyAndPolicy />
                        </div>
                        <div className="flex flex-row-reverse gap-2 py-5 px-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`bg-[#448AFF] text-white text-sm py-3 px-10 rounded-full transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}>
                                Ok
                            </button>
                            <button onClick={onClose} className="cursor-pointer px-2 py-2 text-sm font-medium hover:text-[#12153A]">
                                Close
                            </button>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
}

export default PrivacyModal;