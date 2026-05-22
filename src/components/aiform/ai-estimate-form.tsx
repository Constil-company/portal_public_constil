import { FileImage, Plus } from "lucide-react"
import {  useNavigate } from 'react-router-dom';
const AiEstimateForm = () => {
    const navigate = useNavigate();


    /* ================= UI ================= */

    return (
        <>
            <div className=" pt-20 bg-background p-2">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-foreground">Recent Projects</h1>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            View All
                        </a>
                    </div>

                    <div className="border border-border border-[#98A3B3] rounded-lg p-12 bg-gray-50 ">
                        <div className="flex flex-col items-center justify-center gap-6">
                            <FileImage className="w-12 h-12 text-muted-foreground" color="#98A3B3" strokeWidth={1.5} />
                            <p className="text-foreground text-center">Create your first project by uploading a blueprint</p>
                            <button className="flex gap-3 cursor-pointer bg-[#448AFF] items-center text-white p-3 rounded-lg" onClick={() => navigate("/estimates/ai/steps")}>

                                <span><Plus size={20} /></span>
                                <span>Create Project</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AiEstimateForm;
