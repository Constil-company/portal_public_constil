
import { useNavigate } from "react-router-dom";
import FormInvoice from "../../components/formnewinvoice/forminvoice";

export function NewInvoice() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <>
      <section className="flex-1 flex justify-center h-full w-full ">
        <FormInvoice onClose={handleClose} />
      </section>
    </>
  );
}
