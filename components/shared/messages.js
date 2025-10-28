"use client";

import { ERROR_MESSAGES } from "@/config/constants";
import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
import { CN } from "@/lib/utils";

const MESSAGE_CLASS = "flex items-center gap-3 p-1 rounded-secondary";

export function ErrorMessage({ message, className }) {
  return (
    <div
      className={CN(
        MESSAGE_CLASS,
        "bg-error/40 dark:bg-error/20 border border-dashed border-error text-error",
        className
      )}
      role="alert"
    >
      <div className="size-10 bg-error shrink-0 rounded-tertiary center">
        <Icon
          icon="solar:danger-circle-bold"
          className="text-white"
          size={20}
        />
      </div>
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}

export function SuccessMessage({ message, className }) {
  return (
    <div
      className={CN(
        MESSAGE_CLASS,
        "bg-success/40 dark:bg-success/20 border border-dashed border-success text-success",
        className
      )}
      role="status"
    >
      <div className="size-10 bg-success shrink-0 rounded-tertiary center">
        <Icon icon="solar:check-circle-bold" size={20} className="text-white" />
      </div>
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}

export function WarningMessage({ message, className }) {
  return (
    <div
      className={CN(
        MESSAGE_CLASS,
        "bg-warning/40 dark:bg-warning/20 border border-dashed border-warning text-warning",
        className
      )}
      role="alert"
    >
      <div className="size-10 bg-warning shrink-0 rounded-tertiary center">
        <Icon
          icon="solar:danger-triangle-bold"
          className="text-white"
          size={20}
        />
      </div>
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}

export function InfoMessage({ message, className }) {
  return (
    <div
      className={CN(
        MESSAGE_CLASS,
        "bg-info/40 dark:bg-info/20 border border-dashed border-info text-info",
        className
      )}
      role="status"
    >
      <div className="size-10 bg-info shrink-0 rounded-tertiary center">
        <Icon icon="solar:info-circle-bold" className="text-white" size={20} />
      </div>
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}

export default function Error({
  icon = "solar:danger-circle-bold",
  message = ERROR_MESSAGES.GENERIC,
  title = "Something went wrong",
  fullScreen = false,
  showRetry = true,
  showGoBack = true,
  onRetry,
  className,
}) {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  };

  const containerClasses = CN(
    "flex flex-col items-center justify-center gap-6 p-8",
    fullScreen && "h-screen w-screen fixed inset-0 z-50",
    !fullScreen && "min-h-[400px]",
    className
  );

  return (
    <div className={containerClasses} role="alert" aria-live="assertive">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
          <Icon icon={icon} size={32} className="text-skin-error" />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {message && <p className=" leading-relaxed">{message}</p>}
        <div className="flex items-center gap-3 mt-4">
          {showRetry && (
            <button
              onClick={handleRetry}
              className={CN(
                "px-6 py-2.5 rounded-xl font-medium",
                "bg-primary text-white",
                "hover:opacity-90 active:scale-95",
                "transition-all duration-200",
                "flex items-center gap-2"
              )}
            >
              <Icon icon="solar:refresh-bold" size={18} />
              Retry
            </button>
          )}
          {showGoBack && (
            <button
              onClick={handleGoBack}
              className={CN(
                "px-6 py-2.5 rounded-xl font-medium",
                "transition-all duration-200",
                "flex items-center gap-2"
              )}
            >
              <Icon icon="solar:arrow-left-bold" size={18} />
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  return (
    <Error
      title="Unexpected Error"
      message={
        error?.message ||
        "An unexpected error occurred. Please try again or contact support if the problem persists."
      }
      fullScreen
      showRetry
      showGoBack
      onRetry={resetErrorBoundary}
    />
  );
}
