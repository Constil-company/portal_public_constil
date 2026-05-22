import { Navbar } from '../../layouts/navbar/navbar';
import Sidebar from '../../layouts/sidebar/sidebar';
import Option from '../../components/option/opction';
export function Invoice() {
    return (
        <>
            <div className='main  w-full'>
                <header>
                    <Navbar isWelcomePage={false}/>
                </header>
                <main className="flex flex-col md:flex-row justify-between h-screen p-4 ">
                    <aside className="hidden md:block w-1/5 mb-4 md:mb-0">
                        <Sidebar />
                    </aside>
                    <section className="flex-1 px-4   flex   h-full w-full">
                        <Option />
                    </section>

                </main>
            </div>
        </>
    )
}