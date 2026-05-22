import { SVGProps } from "react";

const InvoiceIcone = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24} // Consistent size
    height={24} // Consistent size
    fill="none"
    {...props}
    className={`mr-2 ${props.className || ""}`} // Merge with Sidebar's className (e.g., mr-3)
  >
    <path
      stroke="currentColor" // Changed from #677582 to inherit parent text color
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M8.5 19H8c-4 0-6-1-6-6V8c0-4 2-6 6-6h8c4 0 6 2 6 6v5c0 4-2 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.53-.4-.8-.4Z"
    />
    <path
      stroke="currentColor" // Changed from #448AFF to inherit parent text color
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.996 11h.01M11.995 11h.01M7.995 11h.008"
    />
  </svg>
);

export default InvoiceIcone;