import { motion } from "framer-motion";
import { useStreamer } from "@/contexts/streamer-context";

export default function Background() {
  const { serverDetails } = useStreamer();
  const background = serverDetails?.BACKGROUND;

  return (
    <>
      <motion.div
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="fixed w-screen h-screen inset-0 -z-10 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: background ? `url(${background})` : "none" }}
      ></motion.div>
      <div className="fixed w-screen h-screen inset-0 -z-10 dark:bg-gradient-to-t dark:from-black dark:via-black/80 dark:to-transparent bg-gradient-to-t from-white via-white/80 to-transparent"></div>
    </>
  );
}
