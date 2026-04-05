import { FC } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";

interface Props {
  duration: number;
}

export const FadeOutro: FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Sequence durationInFrames={duration}>
      <AbsoluteFill style={{ backgroundColor: "black", opacity }} />
    </Sequence>
  );
};
