import { IconProps } from ".";

export const PlusIcon = ({ color = "transparent" }: IconProps) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="plusMask">
        <rect width="40" height="40" fill="white" />
        <path
          d="M18.4577 6.76448L18.3922 6.76448L18.3922 15.1648C18.3922 16.9436 16.9495 18.3863 15.1707 18.3863L6.76448 18.3863L6.76448 21.5423L6.76597 21.6093L15.1663 21.6093C16.9451 21.6093 18.3878 23.0519 18.3878 24.8308L18.3878 33.237L21.5438 33.237L21.6078 33.2355L21.6078 24.8352C21.6078 23.0564 23.0505 21.6137 24.8293 21.6137L33.2355 21.6137V18.4577L33.234 18.3907L24.8337 18.3907C23.0549 18.3907 21.6122 16.948 21.6122 15.1692L21.6122 6.763L18.4562 6.76299L18.4577 6.76448Z"
          fill="black"
        />
      </mask>
    </defs>
    <rect width="40" height="40" rx="10" fill={color} mask="url(#plusMask)" />
  </svg>
);
