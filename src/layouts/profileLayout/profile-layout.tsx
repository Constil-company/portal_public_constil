import { Outlet } from "react-router-dom";
import { MyProfileAside } from "../../components/myProfile/my-profile-aside";

export function ProfileLayout() {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen w-full bg-gray-50">
      <MyProfileAside />
      <div className="flex-1 px-4 lg:px-6 overflow-y-auto max-h-[100vh]">
        <div className="pt-0"> 
          <Outlet />
        </div>
      </div>
    </section>
  );
}
