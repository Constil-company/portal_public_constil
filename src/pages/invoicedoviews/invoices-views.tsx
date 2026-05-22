import { Navbar } from '../../layouts/navbar/navbar';
import Sidebar from '../../layouts/sidebar/sidebar';
import ViewsInvoices from '../../components/viewsinvoices/views-invoices';
export function InvoiceViews() {
   
    return (
        <>
            <div className='main mr-4 ml-4'>
                <header>
                <Navbar isWelcomePage={false} />
                </header>
                <main className="flex flex-col md:flex-row justify-between h-screen p-4 ">
                    <aside className="hidden md:block w-1/5 mb-4 md:mb-0">
                        <Sidebar />
                    </aside>
                    <section className="flex-1 px-4 md:px-8 flex  justify-center h-full w-full">
                       <ViewsInvoices/>
                    </section>
                </main>
            </div>
        </>
    )
}