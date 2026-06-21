"use client";

import { useState } from "react";
import type { Session } from "next-auth";

type Props = {
  session: Session | null;
  signIn: (provider?: string, options?: Record<string, unknown>) => Promise<unknown>;
  signOut: (options?: Record<string, unknown>) => Promise<unknown>;
};

export function AuthPanel({ session, signIn, signOut }: Props) {
  const [auth, setAuth] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");

  async function handleRegister() {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(auth),
    });

    if (!res.ok) {
      setStatus("Account creation failed. Use a unique email and configured database.");
      return;
    }

    await signIn("credentials", {
      email: auth.email,
      password: auth.password,
      redirect: false,
    });

    setStatus("Account created and signed in.");
  }

  async function handleSignIn() {
    await signIn("credentials", {
      email: auth.email,
      password: auth.password,
      redirect: false,
    });
  }

  return (
    <section className="auth-wrap glass-card">
      <h3>User Accounts</h3>
      {session?.user ? (
        <div className="auth-row">
          <p>Signed in as {session.user.email}</p>
          <button className="btn btn-secondary" onClick={() => signOut({ redirect: false })}>Sign Out</button>
        </div>
      ) : (
        <div className="auth-grid">
          <input placeholder="Name" value={auth.name} onChange={(e) => setAuth((v) => ({ ...v, name: e.target.value }))} />
          <input placeholder="Email" value={auth.email} onChange={(e) => setAuth((v) => ({ ...v, email: e.target.value }))} />
          <input
            type="password"
            placeholder="Password"
            value={auth.password}
            onChange={(e) => setAuth((v) => ({ ...v, password: e.target.value }))}
          />
          <button className="btn" onClick={handleRegister}>Register</button>
          <button className="btn btn-secondary" onClick={handleSignIn}>Sign In</button>
          <button className="btn btn-secondary" onClick={() => signIn("github")}>Sign In With GitHub</button>
        </div>
      )}
      <p>{status}</p>
    </section>
  );
}
