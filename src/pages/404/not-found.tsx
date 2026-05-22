
import { useDispatch } from "react-redux";
import image404 from "../../assets/notfound.png"
import { clearAuth } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
export default function NotFound() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const handleLogout = () => {
      dispatch(clearAuth());
      navigate('/');
    };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center text-center max-w-xl">
        
        <img
          src={image404}
          alt="404 not found"
          className="w-72 md:w-96 mb-8"
        />

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Erro 404 — Oops! We couldn't find the page you're looking for.
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-6">
          Please check if the address you entered is correct or return to the homepage.
        </p>

        {/* Button */}
        <div
        onClick={handleLogout}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
        >
          ← back to Login
        </div>
      </div>
    </div>
  );
}
