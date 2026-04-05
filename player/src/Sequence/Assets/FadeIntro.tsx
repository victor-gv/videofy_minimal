import { FC } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";

interface Props {
  duration: number;
}

export const FadeIntro: FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Sequence durationInFrames={duration}>
      <AbsoluteFill style={{ backgroundColor: "black", opacity }} />
    </Sequence>
  );
};
