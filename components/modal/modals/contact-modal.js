"use client";

import { useState } from "react";
import Title from "../title";
import { useModal } from "@/contexts/modal-context";
import { apiService } from "@/services/firebase.service";
import { ErrorMessage, SuccessMessage } from "@/components/shared";

export default function ContactModal({ close, data }) {
  const { close: closeFromContext } = useModal();
  const serverName = data?.serverName || data?.server || data?.name || null;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!message || message.trim().length < 5) {
      setError("Lütfen en az 5 karakterlik bir mesaj yazın");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    if (!validate()) return;
    if (!serverName) {
      setError("Sunucu bilgisi bulunamadı. Lütfen tekrar deneyin");
      return;
    }

    setLoading(true);
    const ok = await apiService.sendMessage(serverName, message.trim());
    setLoading(false);

    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        if (typeof close === "function") close();
        else if (typeof closeFromContext === "function") closeFromContext();
      }, 900);
    } else {
      setError("Mesaj gönderilirken hata oluştu. Lütfen tekrar deneyin");
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
          <ErrorMessage className="w-full" message={error} className="mb-4" />
        )}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı buraya yazın..."
          className="bg-base/5 w-full rounded-secondary h-72 p-5 resize-none"
          disabled={loading || success}
        />
        {success ? (
          <SuccessMessage
            message="Mesajınız başarıyla gönderildi"
            className="w-full"
          />
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full p-4 mt-3 rounded-secondary text-center cursor-pointer font-medium transition-colors ${
              loading
                ? "dark:bg-white/5 bg-black/5 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
          >
            {loading ? "Gönderiliyor..." : "Mesajınızı gönderin"}
          </button>
        )}
      </div>
    </>
  );
}
