
interface MessageBoxProps {
    message: string;
    type: "success" | "error";
}

const MessageBox = ({ message, type }: MessageBoxProps) => {
    if (!message) return null;
    
    const bgColor = type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
    
    return (
        <div className={`${bgColor} p-2 rounded-md mb-6 mt-4`}>{message}</div>
    );
};

export default MessageBox;