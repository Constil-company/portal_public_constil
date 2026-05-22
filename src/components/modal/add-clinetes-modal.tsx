import React, { useState } from 'react';
interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (newClient: CreateClientRequest) => void; 
}


interface CreateClientRequest {
    clientName: string;
    email: string;
    phone: string;
    address: string;
    website?: string; // Opcional
    observation?: string; // Opcional
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [clientName, setClientName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [observation, setObservation] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!clientName || !email) {
            alert('Please fill in the required fields.');
            return;
        }

        const NewClient: CreateClientRequest = {
            clientName,
            email,
            address,
            phone: phone || '', // Ensure phone is always a string
            website,
            observation
        };

        onCreate(NewClient);

        setClientName('');
        setEmail('');
        setAddress('');
        setPhone('');
        setWebsite('');
        setObservation('');
        onClose();
    };



    return (
        <div
            className={`fixed inset-0 flex z-50 items-center justify-center transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
            <div className="bg-white w-[700px] p-6 rounded-lg shadow-lg relative">
                {/* Botão de Fechar */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* Título */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Create a client profile!</h2>
                    <p className="text-gray-600 mb-4">
                        Haven't added any records to Customers yet?
                    </p>
                </div>

                <hr className="mb-7 border border-gray-200" />
                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-700">
                                CLIENT NAME
                            </label>
                            <input
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none transition-all duration-300"
                                placeholder="Type the first name of client"
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required // Campo obrigatório
                            />
                        </div>


                        <div>
                            <label className="text-xs font-semibold text-gray-700">
                                ADDRESS
                            </label>
                            <input
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none transition-all duration-300"
                                placeholder="Type the client address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required // Campo obrigatório
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700">
                                EMAIL
                            </label>
                            <input
                                className="w-full h-[40px] px-2 rounded-lg border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none transition-all duration-300"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required // Campo obrigatório
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700">
                                TELEFONE
                            </label>
                            <input
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none transition-all duration-300"
                                placeholder="Telefone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-semibold uppercase text-gray-700">
                                Observations
                            </label>
                            <textarea
                                className="w-full h-[60px] p-2 rounded-lg border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none transition-all duration-300"
                                placeholder="Observations"
                                value={observation}
                                onChange={(e) => setObservation(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-5 items-center mt-4 border-t border-gray-200 pt-4">
                        <button
                            className="text-gray-500 hover:text-gray-700 text-sm"
                            type="button"
                            onClick={onClose}
                        >
                            Back to the form
                        </button>
                        <button
                            className="bg-[#12153A] text-[14px] text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-[#12153ae8] transition-all duration-300"
                            type="submit"
                        >
                            Create client profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientModal;