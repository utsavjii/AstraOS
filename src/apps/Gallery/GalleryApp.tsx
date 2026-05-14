import { wallpapers } from "../../data/wallpapers";
import { GlassButton } from "../../components/ui/GlassButton";
import { useOS } from "../../state/OSProvider";
import type { AppComponentProps } from "../../types/os";

export default function GalleryApp(_: AppComponentProps) {
  const { state, setSettings, notify } = useOS();
  const images = [...wallpapers, ...state.settings.customWallpapers];
  return (
    <div className="h-full overflow-auto p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {images.map((image) => (
          <article key={image.id} className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06]">
            <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${image.src})` }} />
            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <h3 className="font-semibold text-white">{image.name}</h3>
                <p className="text-xs text-white/42">{image.tone} wallpaper</p>
              </div>
              <GlassButton
                icon="Images"
                variant={state.settings.wallpaperId === image.id ? "ghost" : "primary"}
                onClick={() => {
                  setSettings({ wallpaperId: image.id });
                  notify("Gallery", `${image.name} is now your wallpaper.`, "gallery");
                }}
              >
                {state.settings.wallpaperId === image.id ? "Active" : "Use"}
              </GlassButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
