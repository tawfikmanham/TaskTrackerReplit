import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const confettiPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      duration: 2 + Math.random() * 0.5,
      rotation: Math.random() * 360,
    }));
    setPieces(confettiPieces);

    const timer = setTimeout(() => setPieces([]), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            top: "-10px",
            left: `${piece.left}%`,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            top: "100vh",
            opacity: 0,
            rotate: piece.rotation,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ["#fbbf24", "#60a5fa", "#34d399", "#f472b6", "#a78bfa"][
              Math.floor(Math.random() * 5)
            ],
          }}
        />
      ))}
    </div>
  );
}
