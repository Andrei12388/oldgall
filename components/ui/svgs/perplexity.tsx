
import type { SVGProps } from 'react'

export const Perplexity = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Perplexity"
    {...props}
  >
    <path d="M5 4.5 12 10l7-5.5" />
    <path d="M5 4.5v15l7-5.5 7 5.5v-15" />
    <path d="M12 2v20" />
    <path d="M5 10h14" />
  </svg>
)

