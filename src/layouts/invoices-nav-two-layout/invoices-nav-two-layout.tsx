import { Outlet } from "react-router-dom";
import OpcSecond from "../../components/opcinvoiceestimate/opc-second";

export function InvoiceNavLayoutTwo() {
  return (
    <>     
    
      <section className="flex flex-col lg:flex-row  w-full md:mt-0   bg-white overflow-hidden"> 
        <OpcSecond /> 
       
        <div className="flex-1 overflow-auto"> 
            <Outlet />
        </div>
      </section>
    </>
  );
}