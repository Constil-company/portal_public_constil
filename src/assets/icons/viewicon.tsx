
import { SVGProps } from "react"
const ViewedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={14}
    fill="none"
    {...props}
  >
    <path
      stroke="#12153A"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.517 7a1.993 1.993 0 0 1-1.995 1.995A1.993 1.993 0 0 1 5.526 7c0-1.104.892-1.995 1.996-1.995 1.103 0 1.995.891 1.995 1.995Z"
    />
    <path
      stroke="#12153A"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.522 11.61c1.967 0 3.801-1.16 5.078-3.166.501-.786.501-2.107 0-2.893-1.277-2.007-3.11-3.166-5.078-3.166-1.968 0-3.802 1.16-5.078 3.166-.502.786-.502 2.107 0 2.893 1.276 2.006 3.11 3.166 5.078 3.166Z"
    />
  </svg>
)
export default ViewedIcon
