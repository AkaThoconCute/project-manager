import { useState, useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

interface ParticlesBackgroundProps {
  disableMove?: boolean;
}

const ParticlesBackground = ({ disableMove }: ParticlesBackgroundProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: true, zIndex: -1 },
      background: { color: { value: "rgb(35, 39, 65)" } },
      particles: {
        number: {
          value: 200,
          density: {
            enable: false,
          },
        },
        size: {
          value: 3,
          animation: {
            enable: true,
            speed: 4,
            startValue: "random",
            minimumValue: 0.3,
          },
        },
        links: {
          enable: false,
        },
        move: {
          enable: !disableMove,
          random: true,
          speed: 1,
          direction: "top",
          outModes: {
            default: "out",
          },
        },
        opacity: {
          value: 0.4,
          animation: {
            enable: !disableMove,
          },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: false,
          },
          onClick: {
            enable: false,
          },
        },
      },
    }),
    [disableMove],
  );

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
    />
  );
};

export default ParticlesBackground;
