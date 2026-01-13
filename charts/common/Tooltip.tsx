'use client';

import { useEffect, useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  x: number;
  y: number;
  content: string | React.ReactNode;
  visible?: boolean;
}

export default function Tooltip({ x, y, content, visible = false }: TooltipProps) {
  return (
    <div
      className={styles.tooltip}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        display: visible ? 'block' : 'none',
      }}
    >
      {content}
    </div>
  );
}
