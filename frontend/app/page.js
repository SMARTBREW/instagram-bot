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
    maxWidth: 900,
    margin: "24px auto",
    padding: 24,
    borderRadius: 12,
    background: "white",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  };

  const primaryColor = "#f5cd4c";
  const accentColor = "#000000";
  const backgroundColor = "#f0e9d3";

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
        background: primaryColor,
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 700, color: accentColor }}>Instagram DM</div>
       
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
              <h2 style={{ marginTop: 0, color: accentColor }}>Step 1 · Login (JWT)</h2>
              <p style={{ fontSize: 14, color: "#555" }}>
                This form calls <code>/v1/auth/login</code> on the backend and stores the{" "}
                <code>access.token</code>. Meta reviewers can use the same credentials:
              </p>
              <ul style={{ fontSize: 14, color: "#333" }}>
                <li>
                  Email: <code>reviewer@example.com</code>
                </li>
                <li>
                  Password: <code>Reviewer123</code>
                </li>
              </ul>
              <form onSubmit={handleLogin} style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                {loginError && (
                  <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>{loginError}</p>
                )}
                <button
                  type="submit"
                  style={{
                    background: accentColor,
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 999,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Login and fetch accounts
                </button>
              </form>
            </>
          )}

          {step === "accounts" && (
            <>
              <h2 style={{ marginTop: 0, color: accentColor }}>Step 2 · Connected Instagram account</h2>
              <p style={{ fontSize: 14, color: "#555" }}>
                This view calls <code>/v1/instagram</code> with the JWT and shows the connected
                business account.
              </p>
              <button
                onClick={loadAccounts}
                style={{
                  background: accentColor,
                  color: "white",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                Load accounts
              </button>
              {accountsError && (
                <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>{accountsError}</p>
              )}
              <div>
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    style={{
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      padding: 12,
                      marginBottom: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{acc.username || acc.instagramBusinessId}</div>
                      <div style={{ fontSize: 12, color: "#777" }}>
                        ID: <code>{acc.instagramBusinessId}</code>
                      </div>
                    </div>
                    <button
                      onClick={() => openAccount(acc)}
                      style={{
                        background: primaryColor,
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 999,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      View conversations
                    </button>
                  </div>
                ))}
                {accounts.length === 0 && !accountsError && (
                  <p style={{ fontSize: 13, color: "#666" }}>No accounts loaded yet.</p>
                )}
              </div>
            </>
          )}

          {step === "conversations" && selectedAccount && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ marginTop: 0, color: accentColor }}>Step 3 · Conversations & messages</h2>
                  <p style={{ fontSize: 14, color: "#555" }}>
                    This view calls <code>/v1/conversations/&lt;accountId&gt;</code> to list
                    conversations. Each conversation shows the username fetched via{" "}
                    <code>instagram_basic</code> plus recent messages received via{" "}
                    <code>instagram_manage_messages</code>. Auto-refreshes every 8 seconds.
                  </p>
                  {selectedAccount && (
                    <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: accentColor }}>
                      📱 Account: @{selectedAccount.username || selectedAccount.instagramBusinessId} (ID: {selectedAccount.instagramBusinessId})
                    </div>
                  )}
                </div>
                {isRefreshing && (
                  <span style={{ fontSize: 12, color: "#666" }}>🔄 Refreshing...</span>
                )}
              </div>

              {/* Profile Display Section - Shows instagram_basic usage */}
              {selectedAccount && (
                <div style={{
                  marginBottom: 16,
                  padding: 16,
                  borderRadius: 8,
                  border: "2px solid #f5cd4c",
                  background: "#fffef5",
                }}>
                  <h3 style={{ marginTop: 0, fontSize: 16, color: accentColor }}>
                    📊 Profile Details for @{selectedAccount.username || selectedAccount.instagramBusinessId} (via instagram_basic permission)
                  </h3>
                  {loadingProfile && <p style={{ fontSize: 13, color: "#666" }}>Loading profile...</p>}
                  {profileError && (
                    <p style={{ color: "red", fontSize: 13 }}>Error loading profile: {profileError}</p>
                  )}
                  {profileData && (
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, fontSize: 13 }}>
                      {profileData.profilePictureUrl && (
                        <img
                          src={profileData.profilePictureUrl}
                          alt="Profile"
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            border: "2px solid #f5cd4c",
                            gridRow: "span 4",
                          }}
                        />
                      )}
                      <div><strong>Handle:</strong> @{profileData.username}</div>
                      <div><strong>Name:</strong> {profileData.name || "N/A"}</div>
                      <div><strong>Bio:</strong> {profileData.biography || "No bio"}</div>
                      <div><strong>Followers:</strong> {profileData.followersCount?.toLocaleString() || 0}</div>
                      <div><strong>Posts:</strong> {profileData.mediaCount || 0}</div>
                      {profileData.website && (
                        <div><strong>Website:</strong> <a href={profileData.website} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc" }}>{profileData.website}</a></div>
                      )}
                      <div style={{ gridColumn: "span 2", marginTop: 8 }}>
                        <strong>Recent Media for @{profileData.username} (via instagram_basic):</strong>
                        {profileData.media && profileData.media.length > 0 ? (
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                            gap: 8,
                            marginTop: 8,
                          }}>
                            {profileData.media.map((post) => (
                              <div
                                key={post.id}
                                style={{
                                  aspectRatio: "1",
                                  borderRadius: 4,
                                  overflow: "hidden",
                                  border: "1px solid #ddd",
                                  background: "#f5f5f5",
                                  position: "relative",
                                }}
                              >
                                {post.media_url && (
                                  <img
                                    src={post.media_url}
                                    alt={post.caption || "Post"}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                                {post.media_type && (
                                  <div style={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    background: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    fontSize: 10,
                                    padding: "2px 4px",
                                    borderRadius: 3,
                                  }}>
                                    {post.media_type === "VIDEO" ? "▶" : "📷"}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>No media found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => setStep("accounts")}
                style={{
                  background: "transparent",
                  color: accentColor,
                  border: "1px solid #ccc",
                  padding: "4px 10px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontSize: 12,
                  marginBottom: 12,
                }}
              >
                ← Back to accounts
              </button>
              {convError && (
                <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>{convError}</p>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1.7fr)",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    borderRadius: 8,
                    border: "1px solid #eee",
                    maxHeight: 260,
                    overflowY: "auto",
                    padding: 8,
                    background: "#faf7ee",
                  }}
                >
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        marginBottom: 6,
                        cursor: "pointer",
                        background:
                          selectedConversation && selectedConversation.id === conv.id
                            ? primaryColor
                            : "white",
                        border: "1px solid #e2d5aa",
                        fontSize: 13,
                        position: "relative",
                      }}
                    >
                      <div style={{ fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>@{conv.igUsername || `user_${conv.igUserId?.slice(-6)}`}</span>
                        {conv.unreadCount > 0 && (
                          <span style={{
                            background: "#ff4444",
                            color: "white",
                            borderRadius: "50%",
                            width: 18,
                            height: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                          }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div style={{ color: "#555", marginTop: 2, fontSize: 12 }}>
                        {conv.lastMessage || "(no preview)"}
                      </div>
                    </div>
                  ))}
                  {conversations.length === 0 && !convError && (
                    <p style={{ fontSize: 13, color: "#666", padding: 8 }}>
                      No conversations yet. Send a DM to this Instagram business account from your
                      phone to create one.
                    </p>
                  )}
                </div>

                <div
                  style={{
                    borderRadius: 8,
                    border: "1px solid #eee",
                    padding: 10,
                    background: "white",
                    minHeight: 220,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {selectedConversation ? (
                    <>
                      <div style={{ marginBottom: 8, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          Conversation with @
                          {selectedConversation.igUsername ||
                            `user_${selectedConversation.igUserId?.slice(-6)}`}
                        </div>
                        <div style={{ fontSize: 12, color: "#777" }}>
                          igUserId: <code>{selectedConversation.igUserId}</code>
                        </div>
                        {selectedAccount && (
                          <div style={{ fontSize: 12, color: accentColor, marginTop: 4, fontWeight: 600 }}>
                            📱 Sending from: @{selectedAccount.username || selectedAccount.instagramBusinessId} (ID: {selectedAccount.instagramBusinessId})
                          </div>
                        )}
                      </div>
                      
                      {/* Messages list */}
                      <div style={{
                        flex: 1,
                        overflowY: "auto",
                        maxHeight: 300,
                        marginBottom: 12,
                        padding: "8px 0",
                        border: "1px solid #f0f0f0",
                        borderRadius: 6,
                        background: "#fafafa",
                      }}>
                        {messagesError && (
                          <p style={{ color: "red", fontSize: 12, padding: 8 }}>{messagesError}</p>
                        )}
                        {messages.length === 0 && !messagesError && (
                          <p style={{ fontSize: 12, color: "#666", padding: 8, textAlign: "center" }}>
                            No messages yet. Messages will appear here when received via webhook.
                          </p>
                        )}
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            style={{
                              padding: "6px 10px",
                              margin: "4px 8px",
                              borderRadius: 8,
                              background: msg.sender === "user" ? "#e3f2fd" : "#fff9c4",
                              alignSelf: msg.sender === "user" ? "flex-start" : "flex-end",
                              maxWidth: "80%",
                              fontSize: 13,
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: 11, color: "#666", marginBottom: 2 }}>
                              {msg.sender === "user" 
                                ? `Customer (@${selectedConversation.igUsername || `user_${selectedConversation.igUserId?.slice(-6)}`})`
                                : `You (from @${selectedAccount?.username || selectedAccount?.instagramBusinessId})`}
                            </div>
                            <div style={{ color: "#333" }}>{msg.text || "(no text)"}</div>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>
                                📎 {msg.attachments.length} attachment(s)
                              </div>
                            )}
                            <div style={{ fontSize: 10, color: "#999", marginTop: 4 }}>
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Send form */}
                      <form onSubmit={handleSend} style={{ marginTop: "auto" }}>
                        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                          Send reply from @{selectedAccount?.username || selectedAccount?.instagramBusinessId} (uses <code>instagram_manage_messages</code>)
                        </label>
                        <textarea
                          value={sendText}
                          onChange={(e) => setSendText(e.target.value)}
                          rows={2}
                          style={{
                            width: "100%",
                            padding: 8,
                            borderRadius: 6,
                            border: "1px solid #ccc",
                            resize: "vertical",
                            fontSize: 13,
                          }}
                          placeholder="Type a reply to send via the Graph API…"
                        />
                        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            type="submit"
                            style={{
                              background: accentColor,
                              color: "white",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: 999,
                              cursor: "pointer",
                              fontSize: 13,
                            }}
                          >
                            Send reply
                          </button>
                          {sendStatus && (
                            <span style={{ fontSize: 12, color: "#555" }}>{sendStatus}</span>
                          )}
                        </div>
                      </form>
                    </>
                  ) : (
                    <p style={{ fontSize: 13, color: "#666" }}>
                      Select a conversation from the left to see messages and send a reply.
                    </p>
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


