import { motion } from "framer-motion";
import { getActiveWallpaper } from "../../lib/storage";
import { useParallax } from "../../hooks/useParallax";
import { useOS } from "../../state/OSProvider";

const particles = Array.from({ length: 52 }, (_, index) => ({
  id: index,
  left: (index * 37) % 100,
  top: (index * 19) % 100,
  size: 2 + (index % 4),
  delay: (index % 11) * 0.34,
}));

export function AmbientBackground() {
  const { state } = useOS();
  const offset = useParallax(state.settings.reducedMotion ? 0 : 22);
  const wallpaper = getActiveWallpaper(state.settings);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#07111f]">
      <motion.div
        className="absolute -inset-6 bg-cover bg-center"
        animate={{ x: offset.x, y: offset.y, scale: 1.04 }}
        transition={{ type: "spring", stiffness: 80, damping: 24 }}
        style={{ backgroundImage: `url(${wallpaper.src})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(var(--accent),0.18),transparent_34%),linear-gradient(180deg,rgba(4,9,20,.04),rgba(4,9,20,.72))]" />
      <div className="aurora-ribbon" />
      {!state.settings.reducedMotion
        ? particles.map((particle) => (
            <span
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: particle.size,
                height: particle.size,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))
        : null}
    </div>
  );
}
