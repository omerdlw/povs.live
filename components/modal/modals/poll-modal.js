"use client";

import { useState, useEffect } from "react";
import Title from "../title";
import { apiService } from "@/services/firebase.service";
import { CN } from "@/lib/utils";
import Icon from "@/components/icon";
import { ErrorMessage, WarningMessage } from "@/components/shared";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const USER_ID_KEY = "poll_user_id";

export default function PollModal({ close, data }) {
  const { pollData, serverName } = data || {};
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voteCounts, setVoteCounts] = useState({});

  const pollId = pollData?.created; // Anketi ayırt etmek için oluşturulma zamanını kullanabiliriz

  // Kullanıcı ID'sini localStorage'dan al veya oluştur
  useEffect(() => {
    let storedUserId = localStorage.getItem(USER_ID_KEY);
    if (!storedUserId) {
      storedUserId = generateUUID();
      localStorage.setItem(USER_ID_KEY, storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Oy kullanılıp kullanılmadığını kontrol et
  useEffect(() => {
    if (userId && serverName && pollId) {
      const voteKey = `pollVoted_${serverName}_${pollId}`;
      const voted = localStorage.getItem(voteKey);
      if (voted !== null) {
        setHasVoted(true);
        setSelectedOption(parseInt(voted, 10)); // Kullanıcının önceki oyunu göster
      }
    }
  }, [userId, serverName, pollId]);

  // Oy sayılarını hesapla (pollData değiştiğinde)
  useEffect(() => {
    if (pollData?.votes) {
      const counts = {};
      Object.values(pollData.votes).forEach((optionIndex) => {
        counts[optionIndex] = (counts[optionIndex] || 0) + 1;
      });
      setVoteCounts(counts);

      // Kullanıcının oyunu kontrol et ve seç
      if (userId) {
        const userVote = Object.entries(pollData.votes).find(
          ([uid]) => uid === userId
        )?.[1];
        if (userVote !== undefined) {
          setSelectedOption(parseInt(userVote, 10));
          setHasVoted(true);
        }
      }
    } else {
      setVoteCounts({});
    }
  }, [pollData?.votes, userId]);

  const totalVotes = Object.values(voteCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const handleVote = async () => {
    if (
      selectedOption === null ||
      !userId ||
      !serverName ||
      loading ||
      hasVoted
    )
      return;

    setLoading(true);
    setError("");

    try {
      const success = await apiService.votePoll(
        serverName,
        userId,
        selectedOption
      );
      if (success) {
        setHasVoted(true);
        // Oy sayılarını ve pollData'yı güncelle
        setVoteCounts((prev) => {
          const newCounts = {
            ...prev,
            [selectedOption]: (prev[selectedOption] || 0) + 1,
          };
          return newCounts;
        });

        // pollData'yı güncelle
        if (pollData && pollData.votes) {
          pollData.votes[userId] = selectedOption;
        }
      } else {
        throw new Error("Oy gönderilirken bir hata oluştu.");
      }
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!pollData || !pollData.question) {
    return (
      <>
        <Title title="Anket Yüklenemedi" />
        <div className="p-4 text-center">Anket bilgileri alınamadı.</div>
      </>
    );
  }

  return (
    <div className="w-[450px]">
      <Title title="Anket" description={pollData.question} />
      <div className="p-4 space-y-3">
        {error && <ErrorMessage message={error} className="mb-2" />}
        {pollData.options.map((option, index) => {
          const votesForOption = voteCounts[index] || 0;
          const percentage =
            totalVotes > 0
              ? Math.round((votesForOption / totalVotes) * 100)
              : 0;

          return (
            <div key={index} className="relative">
              <button
                onClick={() => !hasVoted && setSelectedOption(index)}
                disabled={hasVoted || loading}
                className={CN(
                  "w-full text-left p-4 rounded-secondary border transition-colors cursor-pointer relative overflow-hidden",
                  selectedOption === index
                    ? "border-primary bg-primary/10"
                    : "border-base/10 bg-base/5",
                  !hasVoted && "hover:bg-black/10 dark:hover:bg-white/10",
                  hasVoted && "cursor-default"
                )}
              >
                {option}
                {hasVoted && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold opacity-80">
                    {votesForOption} Oy (%{percentage})
                  </span>
                )}
              </button>
              {hasVoted && (
                <div
                  className="absolute top-0 left-0 bottom-0 bg-primary rounded-tertiary opacity-30 pointer-events-none"
                  style={{ width: `${percentage}%` }}
                ></div>
              )}
            </div>
          );
        })}

        {!hasVoted && (
          <button
            onClick={handleVote}
            disabled={selectedOption === null || loading}
            className={CN(
              "w-full p-4 rounded-secondary font-medium transition-colors cursor-pointer",
              selectedOption === null || loading
                ? "bg-black/10 dark:bg-white/10 cursor-not-allowed opacity-50"
                : "bg-primary text-white hover:bg-primary"
            )}
          >
            {loading ? (
              <Icon
                className="animate-spin inline-block mr-2"
                icon="mingcute:loading-3-fill"
                size={20}
              />
            ) : (
              "Oy verin"
            )}
          </button>
        )}
        {hasVoted && <WarningMessage message="Bu ankete zaten oy verdiniz." />}
      </div>
    </div>
  );
}
