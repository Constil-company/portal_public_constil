import { useDispatch } from 'react-redux';
import image404 from '../../assets/server.png';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../../redux/authSlice';
export default function ServerErrorPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center text-center max-w-4xl">
        <img src={image404} alt="404 not found" className="w-72 md:w-96 mb-0" />

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">Error 501 – Not Implemented</h1>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          The server does not support the requested functionality.
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-6">
          Oops! The server cannot process this request because the functionality is not yet implemented.
        </p>

        <div
          onClick={handleLogout}
          className="inline-flex items-center gap-2 cursor-pointer rounded-md bg-blue-600 px-5 py-2.5 text-white text-sm font-medium shadow hover:bg-blue-700 transition">
          ← back to Login
        </div>
      </div>
    </div>
  );
}
