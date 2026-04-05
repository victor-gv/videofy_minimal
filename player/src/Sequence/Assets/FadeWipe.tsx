import { FC } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";

interface Props {
  duration: number;
}

export const FadeWipe: FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, duration / 2, duration], [0, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Sequence durationInFrames={duration}>
      <AbsoluteFill style={{ backgroundColor: "black", opacity }} />
    </Sequence>
  );
};
