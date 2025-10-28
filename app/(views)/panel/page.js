"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "@/services/firebase.service";
import Icon from "@/components/icon";
import { CN as cn } from "@/lib/utils";

// Bileşenleri DIŞARI taşı
const FormInput = ({ label, name, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium mb-1.5 opacity-80"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className="w-full p-3 rounded-[10px] bg-base/5 border border-base/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

const FormTextArea = ({ label, name, value, onChange, rows = 3 }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium mb-1.5 opacity-80"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full p-3 rounded-[10px] bg-base/5 border border-base/10 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
    />
  </div>
);

const FormButton = ({
  onClick,
  type = "button",
  children,
  variant = "primary",
  disabled = false,
}) => {
  // ... (FormButton içeriği aynı kalabilir, dışarıda olması iyi pratik) ...
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/60",
    secondary:
      "bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20",
    danger:
      "bg-red-700 dark:bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-400",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full p-4 rounded-[10px] font-medium transition-colors",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
};

export default function AdminPanel() {
  const [servers, setServers] = useState([]);
  const [selectedServerName, setSelectedServerName] = useState(null);
  const [serverData, setServerData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [isLoadingServers, setIsLoadingServers] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [streamersText, setStreamersText] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("");

  // ... (loadServers, selectServer, handleFormChange, saveChanges, createPoll, deletePoll fonksiyonları aynı kalır) ...
  const loadServers = async () => {
    setIsLoadingServers(true);
    const serverList = await apiService.getServers();
    setServers(serverList || []);
    setIsLoadingServers(false);
  };

  useEffect(() => {
    loadServers();
  }, []);

  const selectServer = async (serverName) => {
    if (!serverName) return;
    setIsLoadingData(true);
    setSelectedServerName(serverName);

    // Düzeltme: getServerDetails kullanıyoruz
    const data = await apiService.getServerDetails(serverName);

    if (data) {
      // getServerDetails'dan dönen veriyi state'e set et
      // Not: getServerDetails tüm alanları döndürmüyor olabilir,
      // panelin ihtiyaç duyduğu tüm alanları döndürdüğünden emin olun
      // veya eksik alanlar için apiService.getServerInfo'yu kullanmaya devam edin
      // (eğer o fonksiyonu silmediyseniz).
      // Şimdilik getServerDetails'ın tüm gerekli veriyi döndürdüğünü varsayalım.
      setServerData(data);
      setEditableData({
        NAME: data.NAME || "",
        CODE: data.CODE || "",
        LOGO: data.LOGO || "",
        BACKGROUND: data.BACKGROUND || "",
        ANNOUNCEMENT: data.ANNOUNCEMENT || "", // Bu alan getServerDetails'da yoksa hata verir
      });
      setStreamersText((data.STREAMERS || []).join("\n"));
      // Eksik kalan alanları (POLL, VIEW, CONTACTS vs.) ayrıca çekmek gerekebilir
      // veya getServerDetails'ı bu alanları da içerecek şekilde güncellemek gerekir.
      // Ya da en basit çözüm, apiService'deki getServerInfo fonksiyonunu geri getirip onu kullanmak.
      // Eğer getServerInfo'yu silmediyseniz, aşağıdaki satırı geri alın:
      // const data = await apiService.getServerInfo(serverName);
    } else {
      setServerData(null);
      setEditableData({});
      setStreamersText("");
    }

    setPollQuestion("");
    setPollOptions("");
    setIsLoadingData(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    if (!serverData || !selectedServerName) return;

    setIsLoadingData(true);

    const streamersArray = streamersText
      .split("\n")
      .filter((s) => s.trim() !== "");

    // ÖNEMLİ: updateServerInfo'nun 'set' kullandığını varsayarsak,
    // tüm veritabanı düğümünü göndermeliyiz. Eksik alanlar silinebilir.
    // Eğer apiService'i atomik 'update' kullanacak şekilde güncellediyseniz,
    // sadece değişen alanları göndermek daha iyi olur.
    // Mevcut apiService.js'deki 'set' kullanımına göre kod:
    const dataToSave = {
      ...(serverData || {}), // Mevcut tüm veriyi al
      ...editableData, // Düzenlenen alanlarla üzerine yaz
      STREAMERS: streamersArray, // Streamerları güncelle
      // POLL, VIEW, CONTACTS gibi diğer alanlar serverData'dan korunmuş olur.
    };

    // Güvenlik: Salt okunur olması gereken alanları (örn: VIEW, CONTACTS)
    // göndermeden önce dataToSave nesnesinden çıkarabilirsiniz.
    delete dataToSave.VIEW;
    delete dataToSave.CONTACTS;
    // delete dataToSave.POLL; // Eğer POLL sadece anket yönetimi kısmından yönetilecekse

    const success = await apiService.updateServerInfo(
      selectedServerName,
      dataToSave
    );

    if (success) {
      alert("Sunucu bilgileri güncellendi.");
    } else {
      alert("Güncelleme sırasında bir hata oluştu.");
    }

    await selectServer(selectedServerName); // Veriyi yeniden yükle
    setIsLoadingData(false);
  };

  const createPoll = async (e) => {
    e.preventDefault();
    if (!pollQuestion || !pollOptions) {
      alert("Lütfen anket sorusunu ve seçenekleri girin.");
      return;
    }

    const optionsArray = pollOptions
      .split(",")
      .map((o) => o.trim())
      .filter((o) => o);

    if (optionsArray.length < 2) {
      alert("Lütfen en az 2 geçerli seçenek girin (virgülle ayrılmış).");
      return;
    }

    const pollData = {
      question: pollQuestion,
      options: optionsArray,
    };

    // apiService'de createPoll fonksiyonunun olduğundan emin olun
    const success = await apiService.createPoll(selectedServerName, pollData);

    if (success) {
      alert("Anket oluşturuldu.");
      await selectServer(selectedServerName); // Veriyi yeniden yükle
    } else {
      alert("Anket oluşturulurken bir hata oluştu.");
    }
    setPollQuestion(""); // Formu temizle
    setPollOptions("");
  };

  const deletePoll = async () => {
    if (!confirm("Mevcut anketi silmek istediğinizden emin misiniz?")) {
      return;
    }

    // apiService'de deletePoll fonksiyonunun olduğundan emin olun
    const success = await apiService.deletePoll(selectedServerName);

    if (success) {
      alert("Anket silindi.");
      await selectServer(selectedServerName); // Veriyi yeniden yükle
    } else {
      alert("Anket silinirken bir hata oluştu.");
    }
  };

  return (
    // ... (JSX kısmı aynı kalır, artık dışarıdaki FormInput ve FormTextArea'yı kullanır) ...
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="w-64 shrink-0 border-r border-base/10 p-4 bg-white/80 dark:bg-black/40 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-base/10">
          Sunucular
        </h2>
        {isLoadingServers ? (
          <div className="flex h-full items-center justify-center text-lg text-black/50 dark:text-white/50">
            <Icon
              icon="mingcute:loading-3-fill"
              size={32}
              className="animate-spin"
            />
          </div>
        ) : (
          <ul className="space-y-1">
            {servers.map((server) => (
              <li key={server.code}>
                <button
                  onClick={() => selectServer(server.name)} // Sunucu adı ile seçiyoruz
                  className={cn(
                    "w-full flex items-center space-x-3 p-2 rounded-[10px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                    server.name === selectedServerName &&
                      "bg-primary border border-primary/50 font-semibold"
                  )}
                >
                  {server.logo && (
                    <img
                      src={server.logo}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="logo"
                    />
                  )}
                  <span className="truncate">{server.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-grow p-6 overflow-y-auto">
        {isLoadingData ? (
          <div className="flex h-full items-center justify-center text-lg text-black/50 dark:text-white/50">
            <Icon
              icon="mingcute:loading-3-fill"
              size={40}
              className="animate-spin"
            />
          </div>
        ) : !serverData ? (
          <div className="flex h-full items-center justify-center text-lg text-black/50 dark:text-white/50">
            Yönetmek için bir sunucu seçin.
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              {editableData.NAME || selectedServerName} Sunucusunu Düzenle
            </h2>
            {/* Temel Bilgiler Formu */}
            <form onSubmit={saveChanges}>
              <h3 className="text-xl font-semibold border-b border-base/10 pb-2 mb-4 mt-6">
                Temel Bilgiler
              </h3>
              <FormInput
                label="Sunucu Adı (NAME)"
                name="NAME"
                value={editableData.NAME || ""}
                onChange={handleFormChange}
              />
              <FormInput
                label="Sunucu Kodu (CODE)"
                name="CODE"
                value={editableData.CODE || ""}
                onChange={handleFormChange}
              />
              <FormInput
                label="Logo URL (LOGO)"
                name="LOGO"
                value={editableData.LOGO || ""}
                onChange={handleFormChange}
              />
              <FormInput
                label="Arka Plan URL (BACKGROUND)"
                name="BACKGROUND"
                value={editableData.BACKGROUND || ""}
                onChange={handleFormChange}
              />
              <FormTextArea
                label="Duyuru (ANNOUNCEMENT)"
                name="ANNOUNCEMENT"
                value={editableData.ANNOUNCEMENT || ""}
                onChange={handleFormChange}
              />
              <FormTextArea
                label="Yayıncılar (STREAMERS) - (Her satıra bir tane)"
                name="STREAMERS"
                value={streamersText}
                onChange={(e) => setStreamersText(e.target.value)}
                rows={5}
              />

              <div className="mt-6">
                <FormButton
                  type="submit"
                  variant="primary"
                  disabled={isLoadingData}
                >
                  {isLoadingData ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </FormButton>
              </div>
            </form>
            <hr className="border-t border-base/10 my-8" />
            {/* Anket Yönetimi */}
            <div>
              <h3 className="text-xl font-semibold border-b border-base/10 pb-2 mb-4 mt-6">
                Anket Yönetimi
              </h3>
              {serverData.POLL && serverData.POLL.question ? (
                <div className="p-4 rounded-[10px] bg-base/5 space-y-3">
                  <h4 className="font-semibold">Aktif Anket</h4>
                  <p>
                    <strong>Soru:</strong> {serverData.POLL.question}
                  </p>
                  <ul className="list-disc pl-5 text-sm">
                    {(serverData.POLL.options || []).map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                  <FormButton
                    onClick={deletePoll}
                    variant="danger"
                    disabled={isLoadingData}
                  >
                    {isLoadingData ? "Siliniyor..." : "Anketi Sil"}
                  </FormButton>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold mb-3">Yeni Anket Oluştur</h4>
                  <form onSubmit={createPoll} className="space-y-4">
                    <FormInput
                      label="Anket Sorusu"
                      name="poll-question"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      required
                    />
                    <FormInput
                      label="Seçenekler (Virgülle ayırın)"
                      name="poll-options"
                      value={pollOptions}
                      onChange={(e) => setPollOptions(e.target.value)}
                      required
                    />
                    <FormButton
                      type="submit"
                      variant="secondary"
                      disabled={isLoadingData}
                    >
                      {isLoadingData ? "Oluşturuluyor..." : "Anketi Oluştur"}
                    </FormButton>
                  </form>
                </div>
              )}
            </div>
            <hr className="border-t border-base/10 my-8" />
            {/* Salt Okunur Bilgiler */}
            <div>
              <h3 className="text-xl font-semibold border-b border-base/10 pb-2 mb-4 mt-6">
                Salt Okunur Bilgiler
              </h3>
              <div className="p-4 rounded-[10px] bg-base/5 space-y-4">
                <div className="font-medium">
                  Görüntülenme (VIEW): {serverData.VIEW || 0}
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    İletişim Mesajları (CONTACTS):
                  </h4>
                  {serverData.CONTACTS &&
                  Object.values(serverData.CONTACTS).length > 0 ? (
                    <ul className="space-y-2 max-h-60 overflow-y-auto p-3 bg-base/5 rounded-[10px]">
                      {Object.values(serverData.CONTACTS)
                        .sort((a, b) => b.timestamp - a.timestamp) // Mesajları yeniden eskiye sırala
                        .map((contact, index) => (
                          <li
                            key={contact.timestamp || index}
                            className="pb-2 border-b border-base/10 last:border-b-0"
                          >
                            <span className="text-xs opacity-70 block">
                              {new Date(contact.timestamp).toLocaleString()}
                            </span>
                            <span className="text-sm break-words">
                              {contact.message}
                            </span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-sm opacity-70">
                      Yeni iletişim mesajı yok.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="h-20"></div> {/* Sayfa sonuna boşluk */}
          </div>
        )}
      </div>
    </div>
  );
}
