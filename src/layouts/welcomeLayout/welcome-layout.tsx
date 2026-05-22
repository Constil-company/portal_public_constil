import { Outlet } from "react-router-dom";
import { Navbar } from "../navbar/navbar";


const WelcomeLayout = () => {
  

  return (
    <div className="">
      <header className={`w-full}`}>
        <Navbar isWelcomePage={true} />
      </header>
      {/* Alterado md:flex-row para lg:flex-row */}
      <main className="flex ds-canvas-light flex-col lg:flex-row justify-between h-screen p-4 border-t border-hairline-on-light">    
       {/* Main Content Area */}
        <section className="flex-1 flex justify-center h-full w-full">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default WelcomeLayout;