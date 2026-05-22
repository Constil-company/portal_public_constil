import { Backdrop, Box, Checkbox, Fade, FormControlLabel, Modal, Typography } from "@mui/material";
import TermsAndConditions from "../../utils/termCondition";

interface TermConditionModalProps {
    open: boolean;
    onClose: () => void;
    accept: boolean;
    setAccept: React.Dispatch<React.SetStateAction<boolean>>;
}

const TermConditionModal = ({ open, onClose, accept, setAccept }: TermConditionModalProps) => {
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
                                Terms of use
                            </span>
                        </div>

                        <div className="flex flex-col px-6 pb-6 max-h-96 overflow-hidden overflow-y-auto">
                            <TermsAndConditions />
                        </div>
                        <div className="flex justify-between  gap-2 py-5 px-6">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={accept}
                                        onChange={(e) => setAccept(e.target.checked)}
                                        sx={{
                                            color: '#448AFF',
                                            '&.Mui-accept': {
                                                color: '#448AFF',
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ color: '#808080' }}>
                                        I confirm that I have read and accept the terms of use and privacy policy.
                                    </Typography>
                                }
                            />
                            <div className="flex gap-3">
                                <button onClick={onClose} className="cursor-pointer px-2 py-2 text-sm font-medium hover:text-[#12153A]">
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={`bg-[#448AFF] text-white text-sm py-3 px-10 rounded-full transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}>
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
}

export default TermConditionModal;