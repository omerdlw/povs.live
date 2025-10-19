"use client";

import { useState } from "react";
import Title from "../title";
import { useModal } from "@/contexts/modal-context";
import { apiService } from "@/services/apiService";

export default function ContactModal({ close, data }) {
  const { close: closeFromContext } = useModal();
  const serverName = data?.serverName || data?.server || data?.name || null;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!message || message.trim().length < 5) {
      setError("Lütfen en az 5 karakterlik bir mesaj yazın.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    if (!validate()) return;
    if (!serverName) {
      setError("Sunucu bilgisi bulunamadı. Lütfen tekrar deneyin.");
      return;
    }

    setLoading(true);
    const ok = await apiService.sendMessage(serverName, message.trim());
    setLoading(false);

    if (ok) {
      setSuccess(true);
      // auto-close modal after brief delay
      setTimeout(() => {
        // prefer context close if available
        if (typeof close === "function") close();
        else if (typeof closeFromContext === "function") closeFromContext();
      }, 900);
    } else {
      setError("Mesaj gönderilirken hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <Title
        title="Buradan iletişime geçebilirsiniz"
        description={
          "Erken veya geç her mesaj okunmaktadır. Gerektiğinde eyleme geçilir"
        }
      />

      <div className="p-4">
        {error && (
          <div className="bg-red-700 text-red-200 dark:bg-red-500 dark:text-red-100 font-semibold rounded-[20px] p-4 mb-3">
            {error}
          </div>
        )}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı buraya yazın..."
          className="bg-black/5 dark:bg-white/5 w-full rounded-[20px] h-72 p-5 resize-none"
          disabled={loading || success}
        />
        <div className="flex items-center justify-between mt-3">
          {success ? (
            <div className="w-full p-4 rounded-[20px] text-center cursor-pointer font-medium transition-colors bg-green-700 dark:bg-green-500 text-green-200 dark:text-green-100">
              Mesajınız başarıyla gönderildi
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full p-4 rounded-[20px] text-center cursor-pointer font-medium transition-colors ${
                loading
                  ? "dark:bg-white/5 bg-black/5 cursor-not-allowed"
                  : "bg-purple-700 dark:bg-purple-500 text-white"
              }`}
            >
              {loading ? "Gönderiliyor..." : "Mesajınızı gönderin"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
