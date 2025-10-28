"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/icon";
import Title from "../title";
import { ErrorMessage } from "@/components/shared";

export default function GalleryModal({ close, data }) {
  const { apiEndpoint, modalTitle } = data;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedData, setFeedData] = useState([]);

  useEffect(() => {
    if (!apiEndpoint) {
      setError("API adresi belirtilmedi.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`Veri çekilemedi: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setFeedData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  const filteredData = feedData.filter((item) => item.images?.length > 0);

  return (
    <div className="w-[600px] h-full flex flex-col">
      <Title
        title={modalTitle || "Akış"}
        description={"Akışı görüntülemek için VPN'e bağlanmanız gerekmekte"}
      />
      <div className="flex-1 overflow-y-auto space-y-4">
        {loading && (
          <div className="w-full h-full center">
            <div className="animate-spin">
              <Icon icon="mingcute:loading-3-fill" size={32} />
            </div>
          </div>
        )}
        {error && <ErrorMessage className="w-auto m-4" message={error} />}
        {!loading && !error && filteredData.length === 0 && (
          <div className="w-full h-full center">
            <p className="opacity-70">Gösterilecek içerik bulunamadı.</p>
          </div>
        )}
        {!loading &&
          !error &&
          filteredData.map((item, index) => (
            <div key={index} className="w-full  border-b border-base/10 p-4">
              {item.images?.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt="Resmi görmek için VPN'e bağlanınız"
                  className="w-full rounded-[15px] mt-2"
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
