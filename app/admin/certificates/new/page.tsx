"use client"

import Link from "next/link"
import { CSSProperties, FormEvent, useState } from "react"

const LEVEL_OPTIONS = [
  "INTERNATIONAL_BAREBOAT_SKIPPER",
  "INTERNATIONAL_SKIPPER",
  "YACHTMASTER",
  "MARINE_COMMUNICATIONS_VHF_SRC",
  "POWERBOAT_SKIPPER",
]

const STATUS_OPTIONS = ["APPROVED", "PENDING"]

function levelLabel(level?: string | null) {
  if (!level) return "-"

  const map: Record<string, string> = {
    INTERNATIONAL_SKIPPER: "INTERNATIONAL SKIPPER",
    INTERNATIONAL_BAREBOAT_SKIPPER: "INTERNATIONAL BAREBOAT SKIPPER",
    MARINE_COMMUNICATIONS_VHF_SRC: "MARINE COMMUNICATIONS VHF / SRC",
    YACHTMASTER: "YACHTMASTER",
    POWERBOAT_SKIPPER: "POWERBOAT SKIPPER",
  }

  return map[level] ?? level.replace(/_/g, " ")
}

function todayAsDDMMYYYY() {
  const d = new Date()
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

export default function NewCertificatePage() {
  const [adminPassword, setAdminPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [program, setProgram] = useState("Offshore Yacht Course")
  const [certificateLevel, setCertificateLevel] = useState("YACHTMASTER")
  const [issueDate, setIssueDate] = useState(todayAsDDMMYYYY())
  const [status, setStatus] = useState("APPROVED")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [createdCertificateId, setCreatedCertificateId] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!adminPassword.trim()) {
      setError("Admin şifresi gerekli.")
      setMessage("")
      return
    }

    if (!fullName.trim()) {
      setError("Ad Soyad gerekli.")
      setMessage("")
      return
    }

    try {
      setSubmitting(true)
      setError("")
      setMessage("")
      setCreatedCertificateId("")

      const res = await fetch("/api/certificates/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPassword: adminPassword.trim(),
          fullName: fullName.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          program: program.trim() || "Offshore Yacht Course",
          certificateLevel,
          issueDate,
          status,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || "Sertifika oluşturulamadı.")
        setMessage("")
        return
      }

      const newCertificateId = data?.certificateId || ""
      setCreatedCertificateId(newCertificateId)

      setMessage(
        newCertificateId
          ? `Sertifika oluşturuldu: ${newCertificateId}`
          : "Sertifika oluşturuldu."
      )

      setFullName("")
      setEmail("")
      setPhone("")
      setProgram("Offshore Yacht Course")
      setCertificateLevel("YACHTMASTER")
      setIssueDate(todayAsDDMMYYYY())
      setStatus("APPROVED")
    } catch {
      setError("Sertifika oluşturulamadı.")
      setMessage("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        padding: "40px 20px 60px",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 38, margin: 0, lineHeight: 1.1 }}>
              Yeni Sertifika
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", marginTop: 8 }}>
              Albatros Sailing için yeni sertifika kaydı oluştur.
            </p>
          </div>

          <Link href="/admin" style={backButtonStyle}>
            Admin Panele Dön
          </Link>
        </div>

        {(error || message) && (
          <div
            style={{
              marginBottom: 18,
              padding: "14px 16px",
              borderRadius: 14,
              border: `1px solid ${
                error ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)"
              }`,
              background: error
                ? "rgba(239,68,68,0.12)"
                : "rgba(34,197,94,0.12)",
              color: "#fff",
            }}
          >
            {error || message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: 16,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <label style={labelStyle}>
            Admin Şifresi
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="ADMIN_PASSWORD"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Ad Soyad
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Test Kaptan"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@albatros.com"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Telefon
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0555..."
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Program
            <input
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Offshore Yacht Course"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Certificate ID
            <input
              value={createdCertificateId || "Otomatik üretilecek"}
              readOnly
              style={{
                ...inputStyle,
                opacity: 0.85,
                cursor: "not-allowed",
              }}
            />
          </label>

          <label style={labelStyle}>
            Certificate Level
            <select
              value={certificateLevel}
              onChange={(e) => setCertificateLevel(e.target.value)}
              style={inputStyle}
            >
              {LEVEL_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {levelLabel(level)}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Issue Date
            <input
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              placeholder="11.03.2026"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...submitButtonStyle,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Oluşturuluyor..." : "Sertifika Oluştur"}
          </button>
        </form>
      </div>
    </main>
  )
}

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 15,
}

const inputStyle: CSSProperties = {
  width: "100%",
  height: 48,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  padding: "0 14px",
  outline: "none",
  fontSize: 16,
  boxSizing: "border-box",
}

const submitButtonStyle: CSSProperties = {
  height: 52,
  borderRadius: 14,
  border: "none",
  background: "#22c55e",
  color: "#fff",
  fontSize: 18,
  fontWeight: 800,
  marginTop: 8,
}

const backButtonStyle: CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
}