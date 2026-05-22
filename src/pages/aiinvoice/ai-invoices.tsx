
import { useNavigate } from "react-router-dom";
import AiInvoiceForm from "../../components/aiform/aiforminvoice";

export function AiInvoice() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); 
  };

  return (
    <>
      <section className="flex-1 flex justify-center h-full w-full ">
        <AiInvoiceForm onClose={handleClose} />
      </section>
    </>
  );
}
