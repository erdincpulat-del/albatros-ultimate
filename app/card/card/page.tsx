export default function CardIndexPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
        color: "#e2e8f0",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          padding: "32px",
          borderRadius: 16,
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.6,
            marginBottom: 12,
          }}
        >
          Albatros Sailing
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Kart Erişimi
        </h1>

        <p
          style={{
            fontSize: 14,
            opacity: 0.7,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Bu sayfa doğrudan erişim için kullanılmaz.
          <br />
          Sertifikanı görüntülemek için sana özel verilen bağlantıyı
          kullanmalısın.
        </p>

        <div
          style={{
            padding: "14px 18px",
            borderRadius: 12,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            fontSize: 13,
            color: "#86efac",
          }}
        >
          ✔ QR kod veya özel link ile giriş yap
        </div>
      </div>
    </main>
  );
}