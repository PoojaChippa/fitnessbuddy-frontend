import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { sendMessage, getConversation } from "../services/message.service";
import { getUserById } from "../services/user.service";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function Messages() {
  const { userId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const messagesEndRef = useRef(null);
  const emojiRef = useRef(null);

  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

  /* =========================
     FORMAT TIME
  ========================= */

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* =========================
     LOAD MESSAGES
  ========================= */

  const loadMessages = async () => {
    try {
      const res = await getConversation(userId);
      const incoming = res.data || [];

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        const newMsgs = incoming.filter((m) => !ids.has(m.id));
        return [...prev, ...newMsgs];
      });
    } catch (err) {
      console.error("Error loading messages", err);
    }
  };

  /* =========================
     LOAD USER
  ========================= */

  const loadUser = async () => {
    try {
      const res = await getUserById(userId);
      setOtherUser(res);
    } catch (err) {
      console.error("User load error", err);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    const initChat = async () => {
      await loadMessages();
      await loadUser();
    };

    initChat();
  }, [userId]);

  /* =========================
     SAFE POLLING (avoid 429)
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadMessages();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* =========================
     CLOSE EMOJI ON OUTSIDE CLICK
  ========================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     CLOSE EMOJI ON ESC KEY
  ========================= */

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowEmoji(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender_id: currentUserId,
      receiver_id: userId,
      text,
      created_at: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");

    try {
      await sendMessage({
        receiver_id: userId,
        text,
      });
    } catch (err) {
      console.error("Send message error", err);
    }
  };

  /* =========================
     ADD EMOJI
  ========================= */

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
  };

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header flex items-center gap-3">
        <div className="chat-avatar">
          {(otherUser?.name?.[0] || "U").toUpperCase()}
        </div>

        <div className="chat-user-info">
          <div className="chat-user-name">
            {otherUser?.name || "Fitness Buddy"}
          </div>
          <div className="chat-user-status">Active now</div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">Start the conversation 👋</p>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;

          return (
            <div
              key={msg.id}
              className={`chat-row ${isMine ? "chat-right" : "chat-left"}`}
            >
              <div
                className={`chat-bubble ${isMine ? "chat-mine" : "chat-other"}`}
              >
                {msg.text}

                <span className="chat-time">{formatTime(msg.created_at)}</span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="chat-input-area">
        {/* EMOJI BUTTON */}
        <button
          type="button"
          className="emoji-toggle"
          onClick={() => setShowEmoji(!showEmoji)}
        >
          😊
        </button>

        {/* EMOJI PICKER */}
        {showEmoji && (
          <div ref={emojiRef} className="emoji-picker">
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              theme={
                document.documentElement.classList.contains("dark")
                  ? "dark"
                  : "light"
              }
              previewPosition="none"
              skinTonePosition="none"
              emojiSize={24}
            />
          </div>
        )}

        {/* INPUT */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="chat-input"
        />

        {/* SEND BUTTON */}
        <button type="submit" className="chat-send">
          ➤
        </button>
      </form>
    </div>
  );
}
