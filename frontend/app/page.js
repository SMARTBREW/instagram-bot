"use client";

import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://instagram-bot-xmt8.onrender.com";

export default function DemoPage() {
  const [step, setStep] = useState("login"); // login | accounts | conversations
  const [token, setToken] = useState("");
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("reviewer@example.com");
  const [password, setPassword] = useState("Reviewer123");

  const [accounts, setAccounts] = useState([]);
  const [accountsError, setAccountsError] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [convError, setConvError] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messagesError, setMessagesError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [sendText, setSendText] = useState("");
  const [sendStatus, setSendStatus] = useState("");

  const commonBox = {
    maxWidth: 1200,
    margin: "24px auto",
    padding: 0,
    borderRadius: 0,
    background: "transparent",
    boxShadow: "none",
  };

  const primaryColor = "#0095f6";
  const accentColor = "#262626";
  const backgroundColor = "#fafafa";

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, []);

  const callApi = async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // Extract error message from various possible formats
      const errorMsg = data.message || 
                      data.error?.message || 
                      data.errors?.[0] || 
                      `Request failed with ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const data = await callApi("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      setToken(data.tokens.access.token);
      setStep("accounts");
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const loadAccounts = async () => {
    setAccountsError("");
    try {
      const data = await callApi("/v1/instagram");
      setAccounts(data);
    } catch (err) {
      setAccountsError(err.message);
    }
  };

  const loadProfile = async (account) => {
    setLoadingProfile(true);
    setProfileError("");
    try {
      const data = await callApi(`/v1/instagram/${account.id}/profile`);
      setProfileData(data);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const openAccount = async (account) => {
    setSelectedAccount(account);
    setSelectedConversation(null);
    setMessages([]);
    setProfileData(null);
    setStep("conversations");
    await loadConversations(account);
    await loadProfile(account);
  };

  const selectConversation = async (conv) => {
    setSelectedConversation(conv);
    await loadMessages(conv.id);
  };

  const loadConversations = async (account) => {
    setConvError("");
    try {
      const data = await callApi(`/v1/conversations/${account.id}`);
      setConversations(data);
    } catch (err) {
      setConvError(err.message);
    }
  };

  const loadMessages = async (conversationId) => {
    setMessagesError("");
    try {
      const data = await callApi(`/v1/messages/${conversationId}`);
      // Reverse to show oldest first (like a chat)
      setMessages([...data].reverse());
    } catch (err) {
      setMessagesError(err.message);
    }
  };

  // Auto-refresh conversations every 8 seconds
  useEffect(() => {
    if (step !== "conversations" || !selectedAccount) return;
    
    const interval = setInterval(async () => {
      setIsRefreshing(true);
      await loadConversations(selectedAccount);
      setIsRefreshing(false);
    }, 8000);

    return () => clearInterval(interval);
  }, [step, selectedAccount, token]);

  // Auto-refresh messages every 5 seconds when conversation is selected
  useEffect(() => {
    if (!selectedConversation?.id) return;
    
    const interval = setInterval(async () => {
      await loadMessages(selectedConversation.id);
    }, 5000);

    // Load immediately
    loadMessages(selectedConversation.id);

    return () => clearInterval(interval);
  }, [selectedConversation?.id, token]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedAccount || !selectedConversation || !sendText.trim()) return;
    setSendStatus("Sending…");
    try {
      await callApi(`/v1/messages/${selectedConversation.id}`, {
        method: "POST",
        body: JSON.stringify({
          text: sendText.trim(),
        }),
      });
      setSendStatus("✅ Message sent successfully!");
      setSendText("");
      // Refresh both conversations and messages
      await loadConversations(selectedAccount);
      if (selectedConversation?.id) {
        await loadMessages(selectedConversation.id);
      }
    } catch (err) {
      // Check if it's a permission error from Meta
      const errorMsg = err.message || "";
      const lowerMsg = errorMsg.toLowerCase();
      
      // Also check nested error data
      const errorData = err.data || {};
      const nestedMsg = (errorData.error?.message || "").toLowerCase();
      const allErrorText = `${errorMsg} ${nestedMsg}`.toLowerCase();
      
      // Meta API permission errors
      if (allErrorText.includes("permission") || 
          allErrorText.includes("instagram_manage_messages") || 
          allErrorText.includes("requires") ||
          allErrorText.includes("capability") ||
          allErrorText.includes("advanced access") ||
          allErrorText.includes("(#200)") ||
          allErrorText.includes("(#10)") ||
          allErrorText.includes("endpoint requires") ||
          allErrorText.includes("does not have the capability")) {
        setSendStatus("❌ Cannot send: The instagram_manage_messages permission is not yet approved by Meta. This is expected during App Review - once the permission is granted, this same API call will work successfully.");
      } else if (allErrorText.includes("forbidden") || err.status === 403) {
        setSendStatus("❌ Cannot send: Permission denied. The instagram_manage_messages permission may not be approved yet.");
      } else {
        setSendStatus(`❌ Send failed: ${err.message}`);
      }
    }
  };

  const header = (
    <div
      style={{
        background: "white",
        borderBottom: "1px solid #dbdbdb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 600, color: accentColor, fontSize: 18 }}>Instagram Messages</div>
       
      </div>
    </div>
  );

  return (
    <>
      {header}
      <main style={{ padding: "16px 12px 40px" }}>
        <section style={commonBox}>
          {step === "login" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ marginTop: 0, marginBottom: 8, color: accentColor, fontSize: 28, fontWeight: 600 }}>
                  Instagram Messages
                </h1>
                <p style={{ fontSize: 15, color: "#8e8e8e", margin: 0 }}>
                  Manage your Instagram Direct Messages
                </p>
              </div>
              <form onSubmit={handleLogin} style={{ maxWidth: 350, margin: "0 auto" }}>
                <div style={{ marginBottom: 16 }}>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 4,
                      border: "1px solid #dbdbdb",
                      fontSize: 14,
                      background: "#fafafa",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 4,
                      border: "1px solid #dbdbdb",
                      fontSize: 14,
                      background: "#fafafa",
                    }}
                  />
                </div>
                {loginError && (
                  <p style={{ color: "#ed4956", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{loginError}</p>
                )}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: primaryColor,
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Log In
                </button>
              </form>
            </>
          )}

          {step === "accounts" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ marginTop: 0, color: accentColor, fontSize: 24, fontWeight: 600 }}>Select Account</h2>
                <button
                  onClick={loadAccounts}
                  style={{
                    background: "transparent",
                    color: primaryColor,
                    border: "1px solid #dbdbdb",
                    padding: "8px 16px",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Refresh
                </button>
              </div>
              {accountsError && (
                <p style={{ color: "#ed4956", fontSize: 14, marginBottom: 16, textAlign: "center" }}>{accountsError}</p>
              )}
              <div>
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => openAccount(acc)}
                    style={{
                      borderRadius: 8,
                      border: "1px solid #dbdbdb",
                      padding: 16,
                      marginBottom: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: "white",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = primaryColor;
                      e.currentTarget.style.background = "#fafafa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#dbdbdb";
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16, color: accentColor }}>@{acc.username || acc.instagramBusinessId}</div>
                      <div style={{ fontSize: 13, color: "#8e8e8e", marginTop: 4 }}>
                        Account ID: {acc.instagramBusinessId}
                      </div>
                    </div>
                    <div style={{ color: primaryColor, fontSize: 14, fontWeight: 600 }}>
                      Open →
                    </div>
                  </div>
                ))}
                {accounts.length === 0 && !accountsError && (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#8e8e8e" }}>
                    <p style={{ fontSize: 15, marginBottom: 8 }}>No accounts found</p>
                    <p style={{ fontSize: 13 }}>Click Refresh to load connected accounts</p>
                  </div>
                )}
              </div>
            </>
          )}

          {step === "conversations" && selectedAccount && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h2 style={{ marginTop: 0, color: accentColor, fontSize: 24, fontWeight: 600 }}>
                    Messages
                  </h2>
                  <p style={{ fontSize: 14, color: "#8e8e8e", marginTop: 4 }}>
                    @{selectedAccount.username || selectedAccount.instagramBusinessId}
                  </p>
                </div>
                <button
                  onClick={() => setStep("accounts")}
                  style={{
                    background: "transparent",
                    color: accentColor,
                    border: "1px solid #dbdbdb",
                    padding: "8px 16px",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Switch Account
                </button>
              </div>

              {convError && (
                <p style={{ color: "#ed4956", fontSize: 14, marginBottom: 16, textAlign: "center" }}>{convError}</p>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 350px) minmax(0, 1fr)",
                  gap: 0,
                  border: "1px solid #dbdbdb",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "white",
                  minHeight: 600,
                }}
              >
                <div
                  style={{
                    borderRight: "1px solid #dbdbdb",
                    maxHeight: 600,
                    overflowY: "auto",
                    padding: 0,
                    background: "white",
                  }}
                >
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        background:
                          selectedConversation && selectedConversation.id === conv.id
                            ? "#f0f0f0"
                            : "white",
                        borderBottom: "1px solid #dbdbdb",
                        fontSize: 14,
                        position: "relative",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedConversation || selectedConversation.id !== conv.id) {
                          e.currentTarget.style.background = "#fafafa";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedConversation || selectedConversation.id !== conv.id) {
                          e.currentTarget.style.background = "white";
                        }
                      }}
                    >
                      <div style={{ fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ color: accentColor }}>@{conv.igUsername || `user_${conv.igUserId?.slice(-6)}`}</span>
                        {conv.unreadCount > 0 && (
                          <span style={{
                            background: primaryColor,
                            color: "white",
                            borderRadius: "50%",
                            minWidth: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "0 6px",
                          }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div style={{ color: "#8e8e8e", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {conv.lastMessage || "No messages"}
                      </div>
                    </div>
                  ))}
                  {conversations.length === 0 && !convError && (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: "#8e8e8e" }}>
                      <p style={{ fontSize: 15, marginBottom: 4 }}>No conversations</p>
                      <p style={{ fontSize: 13 }}>Messages will appear here when customers contact you</p>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: 0,
                    background: "white",
                    minHeight: 600,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {selectedConversation ? (
                    <>
                      <div style={{ padding: "16px", borderBottom: "1px solid #dbdbdb", background: "#fafafa" }}>
                        <div style={{ fontWeight: 600, fontSize: 16, color: accentColor }}>
                          @{selectedConversation.igUsername ||
                            `user_${selectedConversation.igUserId?.slice(-6)}`}
                        </div>
                        {selectedAccount && (
                          <div style={{ fontSize: 12, color: "#8e8e8e", marginTop: 4 }}>
                            Replying as @{selectedAccount.username || selectedAccount.instagramBusinessId}
                          </div>
                        )}
                      </div>
                      
                      {/* Messages list */}
                      <div style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "16px",
                        background: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}>
                        {messagesError && (
                          <p style={{ color: "#ed4956", fontSize: 13, padding: 8, textAlign: "center" }}>{messagesError}</p>
                        )}
                        {messages.length === 0 && !messagesError && (
                          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#8e8e8e" }}>
                            <div style={{ textAlign: "center" }}>
                              <p style={{ fontSize: 15, marginBottom: 4 }}>No messages yet</p>
                              <p style={{ fontSize: 13 }}>Start the conversation</p>
                            </div>
                          </div>
                        )}
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: msg.sender === "user" ? "flex-start" : "flex-end",
                              maxWidth: "70%",
                            }}
                          >
                            <div
                              style={{
                                padding: "10px 14px",
                                borderRadius: 18,
                                background: msg.sender === "user" ? "#efefef" : primaryColor,
                                color: msg.sender === "user" ? accentColor : "white",
                                fontSize: 14,
                                lineHeight: 1.4,
                                wordWrap: "break-word",
                              }}
                            >
                              {msg.text || "(no text)"}
                            </div>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div style={{ fontSize: 12, color: "#8e8e8e", marginTop: 4, padding: "0 4px" }}>
                                {msg.attachments.length} attachment{msg.attachments.length > 1 ? "s" : ""}
                              </div>
                            )}
                            <div style={{ fontSize: 11, color: "#8e8e8e", marginTop: 4, padding: "0 4px" }}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Send form */}
                      <form onSubmit={handleSend} style={{ marginTop: "auto", padding: "16px", borderTop: "1px solid #dbdbdb", background: "#fafafa" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                          <textarea
                            value={sendText}
                            onChange={(e) => setSendText(e.target.value)}
                            rows={1}
                            style={{
                              flex: 1,
                              padding: "10px 14px",
                              borderRadius: 22,
                              border: "1px solid #dbdbdb",
                              resize: "none",
                              fontSize: 14,
                              fontFamily: "inherit",
                              background: "white",
                              maxHeight: 100,
                            }}
                            placeholder="Message..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (sendText.trim()) {
                                  handleSend(e);
                                }
                              }
                            }}
                          />
                          <button
                            type="submit"
                            disabled={!sendText.trim()}
                            style={{
                              background: sendText.trim() ? primaryColor : "#c0dffd",
                              color: "white",
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: 22,
                              cursor: sendText.trim() ? "pointer" : "not-allowed",
                              fontSize: 14,
                              fontWeight: 600,
                              minWidth: 80,
                            }}
                          >
                            Send
                          </button>
                        </div>
                        {sendStatus && (
                          <div style={{ marginTop: 8, fontSize: 12, color: sendStatus.includes("✅") ? "#0095f6" : "#ed4956", textAlign: "center" }}>
                            {sendStatus}
                          </div>
                        )}
                      </form>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#8e8e8e" }}>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 15, marginBottom: 4 }}>Select a conversation</p>
                        <p style={{ fontSize: 13 }}>Choose a conversation from the list to view messages</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}



