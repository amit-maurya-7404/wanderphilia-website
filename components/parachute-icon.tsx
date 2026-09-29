import React from 'react'

export interface ParachuteIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  strokeWidth?: number | string
}

export function Parachute({
  size = 18,
  className = '',
  strokeWidth = 2,
  ...props
}: ParachuteIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M22 12a10 10 0 1 0-20 0" />
      <path d="M22 12c0-1.66-1.46-3-3.25-3s-3.25 1.34-3.25 3c0-1.66-1.57-3-3.5-3s-3.5 1.34-3.5 3c0-1.66-1.46-3-3.25-3s-3.25 1.34-3.25 3" />
      <path d="M2 12l10 10l-3.5-10" />
      <path d="M15.5 12l-3.5 10l10-10" />
    </svg>
  )
}

export default Parachute
