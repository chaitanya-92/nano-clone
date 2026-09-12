import type { SVGProps } from "react";

export default function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.41-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.38Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.39l-3.23-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.83-1.76-5.62-4.13H3.04v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.38 13.93a6 6 0 0 1 0-3.86V7.48H3.04a10 10 0 0 0 0 9.04l3.34-2.59Z" />
      <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.5 3.83 1.49l2.87-2.87C16.96 2.9 14.7 2 12 2a10 10 0 0 0-8.96 5.48l3.34 2.59C7.17 7.7 9.39 5.94 12 5.94Z" />
    </svg>
  );
}