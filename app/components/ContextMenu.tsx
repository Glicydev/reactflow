"use client";

import { useClickOutside } from "@react-hooks-hub/use-click-outside";
import { AnimatePresence, motion, TargetAndTransition } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ContextMenuProps {
  isOpened: boolean;
  children: ReactNode;
  x: number;
  y: number;
  onClose?: () => void;
}

export default function ContextMenu({
  isOpened,
  children,
  x,
  y,
  onClose = () => {},
}: ContextMenuProps) {
  const menuRef = useRef(null);

  const initState = {
    y: -10,
    opacity: 0,
    scale: 0.9
  } as TargetAndTransition;

  const openState = {
    y: 0,
    opacity: 1,
    scale: 1
  } as TargetAndTransition;

  useClickOutside([menuRef], (isOutside) => {
    if (isOutside) {
      onClose();
    }
  });

  return (
    <AnimatePresence>
      {isOpened && (
        <motion.ul
          ref={menuRef}
          className={`contextMenu bg-neutral-900 border border-neutral-800 cursor-pointer w-50 rounded-lg absolute overflow-hidden z-10`}
          style={{
            left: `${x}px`,
            top: `${y}px`
          }}
          initial={initState}
          animate={openState}
          exit={initState}
        >
          {children}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}
