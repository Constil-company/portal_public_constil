import { useState } from 'react';
import SubscriptionIcon from "../../assets/image/subscription-icon.png";
import FormnewproductModal from '../formnewproduct/new-proct-form';

export function EmptyProductList(){
    
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const newproduct = () => {
        setIsModalOpen(true); 
    };
        return(
            <div className="text-center ml-[-16%]">
            <div className="flex items-center justify-center">
                <img src={SubscriptionIcon} alt="" width={300} draggable="false" className="pointer-events-none" />
            </div>
            <h2 className="text-2xl font-semibold">Create your invoice in seconds! 🧾</h2>
            <p className="text-gray-600 mt-2">
                Add the details, generate the document, and <br />
                send it to the client with ease. Start now!
            </p>
            <button onClick={newproduct} className="mt-4 bg-[#12153A] hover:bg-[#1A1E50] text-white p-3 w-2xs rounded-full cursor-pointer transition duration-300">
                Create new product
            </button>

            <FormnewproductModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
        )
}