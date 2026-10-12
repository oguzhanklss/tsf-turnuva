import { asset } from '@/lib/assets';

/** Phosphor icon, drawn from `/public/assets/icons` and tinted by CSS. */
export function Icon({
  name,
  size = 22,
  className = '',
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      className={`icon ${className}`}
      src={asset(`/assets/icons/${name}.svg`)}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  );
}
