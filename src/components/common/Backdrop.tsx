import clsx from "clsx";
import React, { HTMLAttributes, MouseEventHandler } from "react";

interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean;
}

function Backdrop(props: Partial<BackdropProps>) {
  const { show, onClick, className } = props;
  return (
    <div
      className={clsx(
        "fixed inset-0 bg-black opacity-70 transition-opacity",
        [show && "visible"],
        [!show && "invisible opacity-0"],
        className
      )}
      onClick={onClick}
    />
  );
}

export default Backdrop;
