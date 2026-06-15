import { isEmbedVideoUrl } from "@/lib/media";

type LessonVideoProps = {
  videoUrl: string;
  title: string;
};

export function LessonVideo({ videoUrl, title }: LessonVideoProps) {
  if (isEmbedVideoUrl(videoUrl)) {
    return (
      <iframe
        src={videoUrl}
        className="h-full w-full"
        allowFullScreen
        title={title}
      />
    );
  }

  return (
    <video
      src={videoUrl}
      controls
      playsInline
      preload="metadata"
      className="h-full w-full bg-ink"
    >
      <track kind="captions" />
      Your browser does not support video playback.
    </video>
  );
}
