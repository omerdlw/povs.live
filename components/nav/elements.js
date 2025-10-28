import { motion, AnimatePresence } from "framer-motion";
import Iconify from "@/components/icon";

export const Description = ({ text, isActive }) => {
  return (
    <div className="relative h-5">
      <AnimatePresence mode="wait">
        <motion.p
          transition={{ duration: 0.15 }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-sm"
          key={text}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export const Icon = ({ icon, isActive }) => {
  const isUrl = typeof icon === "string" && icon.startsWith("http");

  if (isUrl) {
    return (
      <div
        className={`w-[52px] h-[52px] rounded-secondary bg-cover bg-center bg-no-repeat`}
        style={{ backgroundImage: `url(${icon})` }}
      />
    );
  }

  return (
    <div className="flex items-center justify-center size-[52px] rounded-secondary bg-base/5">
      <span className="text-2xl">
        <Iconify icon={icon} />
      </span>
    </div>
  );
};

export const Title = ({ text, isActive }) => {
  return (
    <h3
      className={`font-semibold text-base pr-4 ${
        isActive ? "text-primary" : ""
      }`}
    >
      {text}
    </h3>
  );
};
