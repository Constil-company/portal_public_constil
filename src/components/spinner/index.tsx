import { twMerge } from "tailwind-merge";

type Props = {
    className?: string;
};

export default function Spinner({className}: Props) {
    return (
        <svg
            className={twMerge(
                "animate-spin h-5 w-5 text-white",
                className
            )}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"></path>
        </svg>
    )
}