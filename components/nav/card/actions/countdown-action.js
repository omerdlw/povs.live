import { useEffect, useState } from "react";

export default function CountdownAction() {
  const targetDate = new Date(2025, 9, 21, 0, 0, 0);
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

  return (
    <div className="h-auto rounded-[20px] mt-2.5 w-full center p-4 gap-3 bg-black/5 dark:bg-white/5">
      <p className="text-sm lowercase">
        {timeLeft.hours} saat {timeLeft.minutes} dakika {timeLeft.seconds}{" "}
        saniye
      </p>
    </div>
  );
}
