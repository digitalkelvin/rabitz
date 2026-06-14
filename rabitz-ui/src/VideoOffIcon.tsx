import { JSX } from "solid-js";

export function VideoOffIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
