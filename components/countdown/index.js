import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/contexts/settings-context";
import { useModal } from "@/contexts/modal-context";
import { apiService } from "@/services/firebase.service";
import HomeControls from "../controls/views/home-controls";

export default function Countdown() {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const video3Ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const { setTheme } = useSettings();
  const { openModal } = useModal();

  const targetDate = new Date(2025, 8, 25, 18, 0, 0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTheme("dark");

    const videos = [video1Ref.current, video2Ref.current, video3Ref.current];
    const handleTimeSync = () => {
      if (!playing) return;

      const mainVideo = video2Ref.current;
      if (!mainVideo) return;

      const syncVideos = [video1Ref.current, video3Ref.current];
      syncVideos.forEach((video) => {
        if (!video) return;
        if (Math.abs(video.currentTime - mainVideo.currentTime) > 0.1) {
          video.currentTime = mainVideo.currentTime;
        }
      });
    };

    videos.forEach((video) => {
      if (!video) return;
      video.addEventListener("timeupdate", handleTimeSync);
    });

    return () => {
      videos.forEach((video) => {
        if (!video) return;
        video.removeEventListener("timeupdate", handleTimeSync);
      });
    };
  }, [playing]);

  const handleTimeUpdate = () => {
    const videos = [video1Ref.current, video2Ref.current, video3Ref.current];
    videos.forEach((video) => {
      if (!video) return;
      const videoElement = video;
      if (
        videoElement.duration &&
        videoElement.currentTime >= videoElement.duration - 2
      ) {
        videoElement.pause();
        videoElement.currentTime = 0;
        setPlaying(false);
      }
    });
  };

  const handleToggle = async () => {
    const videos = [video1Ref.current, video2Ref.current, video3Ref.current];

    if (playing) {
      videos.forEach((video) => video?.pause());
    } else {
      try {
        await Promise.all(
          videos.map((video) => {
            if (!video) return Promise.resolve();
            return new Promise((resolve) => {
              if (video.readyState >= 4) {
                resolve();
              } else {
                video.addEventListener("canplaythrough", () => resolve(), {
                  once: true,
                });
              }
            });
          })
        );

        videos.forEach((video) => {
          if (!video) return;
          video.currentTime = 0;
        });

        const playPromises = videos.map((video) => {
          if (!video) return Promise.resolve();
          return video.play();
        });

        await Promise.all(playPromises);
      } catch (error) {
        console.error("Video playback error:", error);
      }
    }

    setPlaying(!playing);
  };

  useEffect(() => {
    const unsubscribe = apiService.watchServerChanges(
      "vennyz",
      (serverData) => {
        if (serverData && serverData.ANNOUNCEMENT) {
          setAnnouncement(serverData.ANNOUNCEMENT);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="w-screen h-screen fixed flex flex-auto -z-10 overflow-hidden">
        <video
          className="w-1/4 h-screen object-cover brightness-50 blur-md"
          onTimeUpdate={handleTimeUpdate}
          ref={video1Ref}
          muted
        >
          <source src="/countdown-video.mp4" type="video/mp4" />
        </video>
        <video
          className="!w-1/2 shrink-0 h-screen object-cover"
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onTimeUpdate={handleTimeUpdate}
          ref={video2Ref}
        >
          <source src="/countdown-video.mp4" type="video/mp4" />
        </video>
        <video
          className="w-1/4 h-screen object-cover brightness-50 blur-md"
          onTimeUpdate={handleTimeUpdate}
          ref={video3Ref}
          muted
        >
          <source src="/countdown-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div
        style={{ backgroundImage: "url(/noise.webp)" }}
        className="w-screen h-screen fixed inset-0 mix-blend-overlay opacity-60 bg-center bg-cover -z-10"
      />
      <div className="w-screen h-screen -z-10 fixed inset-0 bg-gradient-to-l from-black/70 via-transparent to-transparent"></div>
      <div className="w-screen h-screen -z-10 fixed inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      <div className="w-screen h-screen -z-10 fixed inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"></div>
      <div className="w-screen h-screen -z-10 fixed inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent"></div>
      {announcement && (
        <div className="fixed top-0 left-0 right-0 w-auto z-20 border-b border-base/10 text-sm opacity-60 backdrop-blur-lg p-4">
          {announcement}
        </div>
      )}
      <div className="fixed left-0 right-0 bottom-0 w-full h-[100px] flex items-center justify-between z-30 select-none pointer-events-none">
        <HomeControls
          playing={playing}
          handleToggle={handleToggle}
          isCountdown={true}
        />
      </div>
    </>
  );
}
