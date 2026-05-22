import FormInvoiceEstimate from '../../components/forminvoiceestimate/formin-voicestimate';
import { useNavigate } from 'react-router-dom';

export function NewInvoiceEstimate() {
    const navigate = useNavigate();

    return (
        <>

            <section className="flex-1  ">
                <FormInvoiceEstimate onClose={() => navigate(-1)} />
            </section>

        </>
    )
}
