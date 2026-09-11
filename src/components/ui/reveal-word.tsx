import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface RevealWordProps {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  highlight?: boolean;
}

export function RevealWord({
  word,
  index,
  total,
  progress,
  highlight = false,
}: RevealWordProps) {
  const start = 0.18 + (index / total) * 0.48;
  const end = start + 0.12;

  const color = useTransform(
    progress,
    [start, end],
    highlight
      ? ["#dfe7f3", "#1769ff"]
      : ["#d7d7d7", "#202124"],
  );

  return (
    <motion.span style={{ color }}>
      {word}
    </motion.span>
  );
}