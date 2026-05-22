import { Navbar } from '../../layouts/navbar/navbar';
import Sidebar from '../../layouts/sidebar/sidebar';
import ViewsEstimateComponent from '../../components/viewsestimated/viewsetimate';
export function ViewsEstimate() {
   
    return (
        <>
            <div className='main mr-4 ml-4'>
                <header>
                <Navbar  isWelcomePage={false}/>
                </header>
                <main className="flex flex-col md:flex-row justify-between h-screen p-4 ">
                    <aside className="hidden md:block w-1/10 mb-4 md:mb-0">
                        <Sidebar />
                    </aside>
                    <section className="">
                       <ViewsEstimateComponent/>
                    </section>
                </main>
            </div>
        </>
    )
}