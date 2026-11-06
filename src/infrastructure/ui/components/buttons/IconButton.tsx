import { clsx } from "clsx";
import type { ReactNode } from "react";

type IconButtonProps = {
  onClick?: () => void;
  className?: string;
  icon: ReactNode;
};

export const IconButton = ({
  icon,
  className,
  onClick,
  ...rest
}: IconButtonProps) => {
  return (
    <button
      className={clsx(
        "ease-in-out cursor-pointer transition-all hover:scale-[1.05] hover:opacity-90 active:scale-[0.95]",
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {icon}
    </button>
  );
};
