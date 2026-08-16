"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ATOM_RADIUS, DOUBLE_BOND_GAP, trimToEdges } from "../layout";

interface BondLineProps {
  visible: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  order: 1 | 2;
}

const lineClass = "stroke-ink/70 dark:stroke-bone/70";

/** A single bond (one line) or a double bond (two parallel lines), fading/scaling in once `visible` flips true. */
export function BondLine({ visible, x1, y1, x2, y2, order }: BondLineProps) {
  const edges = trimToEdges(x1, y1, x2, y2, ATOM_RADIUS);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {order === 1 ? (
            <line
              x1={edges.x1}
              y1={edges.y1}
              x2={edges.x2}
              y2={edges.y2}
              strokeWidth={4}
              className={lineClass}
              strokeLinecap="round"
            />
          ) : (
            <>
              <line
                x1={edges.x1}
                y1={edges.y1 - DOUBLE_BOND_GAP}
                x2={edges.x2}
                y2={edges.y2 - DOUBLE_BOND_GAP}
                strokeWidth={4}
                className={lineClass}
                strokeLinecap="round"
              />
              <line
                x1={edges.x1}
                y1={edges.y1 + DOUBLE_BOND_GAP}
                x2={edges.x2}
                y2={edges.y2 + DOUBLE_BOND_GAP}
                strokeWidth={4}
                className={lineClass}
                strokeLinecap="round"
              />
            </>
          )}
        </motion.g>
      ) : null}
    </AnimatePresence>
  );
}
