import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const navigate = useNavigate();

  function goToNextStep() {
    navigate('/user/detail');
  }

  return (
    <div className="flex justify-center w-full h-screen mt-10 md:mt-0 bg-[#fafafa]">
      {/* Área de Login - Apenas ajustes para mobile */}
      <div className="flex  flex-col items-center  justify-center md:p-8  relative p-2">
        <div className="w-full mt-[-50%]  md:w-full border p-10 md:p-4 border-gray-200 rounded-2xl bg-white flex flex-col items-center justify-center shadow-lg">
          {/* Conteúdo mantido IDÊNTICO ao original */}

          <div className="rounded-md p-8 text-center">
            <img src="entrepraise.svg" className="mx-auto w-80 h-80 object-contain" alt="Invoice illustration" />
          </div>
          <div className='w-full p-4 mb-6'>
            <h1 className="text-2xl text-center font-medium">Welcome to Your Invoice Hub</h1>
            <p className="text-center text-gray-600 text-base mt-2 mb-6">
              Let's set things up to match your business and <br></br> make the most of your invoicing experience.
            </p>
          </div>

          <button
            type="button"
            onClick={goToNextStep}
            className="btn_auth text-white p-3 w-full cursor-pointer flex items-center justify-center rounded-2xl bg-blue-600 mb-7 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out">
            {'Start Customizing'}
          </button>
        </div>
      </div>
    </div>
  );
}
