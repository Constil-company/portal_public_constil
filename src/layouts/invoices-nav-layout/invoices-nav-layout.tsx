import { Outlet } from "react-router-dom";
import OpcInvoiceEstimate from "../../components/opcinvoiceestimate/opc-estimate";

export function InvoiceNavLayout() {
  return (
    <>     
    
      <section className="flex flex-col lg:flex-row  w-full md:mt-0   bg-white overflow-hidden"> 
        <OpcInvoiceEstimate /> 
       
        <div className="flex-1 overflow-auto"> 
            <Outlet />
        </div>
      </section>
    </>
  );
}