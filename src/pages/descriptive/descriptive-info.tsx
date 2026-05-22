import { useState } from 'react';
import { Plus, ChevronDown, FileText, Image, Send } from 'lucide-react';

const Descriptive = () => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('General');
  const [openPlus, setOpenPlus] = useState(false);
  const suggestions = [
    {
      title: 'Write documentation',
      desc: 'Generate clean technical docs',
      value: 'Write documentation for my project',
    },
    {
      title: 'Explain code',
      desc: 'Understand complex logic',
      value: 'Explain this code step by step',
    },
    {
      title: 'Marketing copy',
      desc: 'Create catchy content',
      value: 'Write marketing copy for my product',
    },
    {
      title: 'Fix a bug',
      desc: 'Debug my issue',
      value: 'Help me fix a bug in my code',
    },
  ];

  return (
    <main className="h-[calc(100vh-3rem)] flex items-center  justify-center bg-gradient-to-b from-[#fdfbfb] to-[#ece9e9] rounded-2xl">
      <div className="w-full max-w-3xl px-4">
        <h1 className="text-center text-gray-800 text-2xl font-medium mb-8">Hey, Ready to dive in?</h1>
        <div className="relative flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-md">
          {/* Plus Button */}
          <div className="relative">
            <button onClick={() => setOpenPlus(!openPlus)} className="text-gray-500 hover:text-gray-800">
              <Plus size={18} />
            </button>

            {/* Plus Popup */}
            {openPlus && (
              <div className="absolute bottom-12 left-0 w-44 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden z-10">
                <button className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full">
                  <FileText size={12} /> Upload document
                </button>
                <button className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full">
                  <Image size={12} /> Upload image
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Ask anything"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
          />

          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="appearance-none bg-gray-100 text-gray-700 text-xs rounded-full px-3 py-1 pr-6 outline-none cursor-pointer">
              <option>General</option>
              <option>Docs</option>
              <option>Code</option>
              <option>Marketing</option>
            </select>

            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <button className="bg-black text-white rounded-full p-2 hover:scale-105 transition">
            <Send size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => setValue(item.value)}
              className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-sm transition">
              <p className="font-medium text-gray-800 text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Descriptive;
