"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

type ProfileMenuProps = {
  profile: {
    name: string;
    email: string;
    phone: string;
    preferences: string[];
  };
};

function initialsFor(name: string, email: string) {
  const source = name.trim() || email.trim();
  const parts = source.split(/[\s@.]+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function splitPhone(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return { countryCode: "+1", nationalNumber: "" };
  }

  const match = trimmed.match(/^(\+\d{1,4})\s*(.*)$/);

  return {
    countryCode: match?.[1] ?? "+1",
    nationalNumber: match?.[2]?.trim() ?? trimmed,
  };
}

export function ProfileMenu({ profile }: ProfileMenuProps) {
  const initials = initialsFor(profile.name, profile.email) || "HC";
  const initialPhone = profile.phone === "Not configured" ? "" : profile.phone;
  const initialPhoneParts = splitPhone(initialPhone);
  const [countryCode, setCountryCode] = useState(initialPhoneParts.countryCode);
  const [nationalNumber, setNationalNumber] = useState(initialPhoneParts.nationalNumber);
  const [savedMobilePhone, setSavedMobilePhone] = useState(initialPhone);
  const [status, setStatus] = useState("");
  const hasMobilePhone = savedMobilePhone.trim().length > 0;

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { profile?: { mobilePhone: string | null } };
        const value = payload.profile?.mobilePhone ?? "";

        if (isMounted) {
          const parts = splitPhone(value);
          setCountryCode(parts.countryCode);
          setNationalNumber(parts.nationalNumber);
          setSavedMobilePhone(value);
        }
      } catch {
        if (isMounted) {
          setStatus("Mobile number could not be loaded.");
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function saveMobilePhone() {
    setStatus("Saving...");

    try {
      const mobilePhone = nationalNumber.trim().length > 0 ? `${countryCode.trim()} ${nationalNumber.trim()}` : "";
      const response = await fetch("/api/profile", {
        body: JSON.stringify({ mobilePhone }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { profile?: { mobilePhone: string | null }; error?: string };

      if (!response.ok || !payload.profile) {
        throw new Error(payload.error ?? "Mobile number could not be saved.");
      }

      const value = payload.profile.mobilePhone ?? "";
      const parts = splitPhone(value);
      setCountryCode(parts.countryCode);
      setNationalNumber(parts.nationalNumber);
      setSavedMobilePhone(value);
      setStatus("Saved");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Mobile number could not be saved.");
    }
  }

  return (
    <details className="profile-menu">
      <summary aria-label="Open profile menu" className={hasMobilePhone ? "" : "missing-mobile"}>
        <span className="profile-avatar-wrap">
          <span className="profile-avatar" aria-hidden="true">{initials}</span>
          {!hasMobilePhone ? <span className="profile-alert-badge" aria-hidden="true">!</span> : null}
        </span>
        <span className="profile-chevron" aria-hidden="true" />
      </summary>

      <div className="profile-popover">
        <div className="profile-heading">
          <span className="profile-avatar large" aria-hidden="true">{initials}</span>
          <div className="profile-heading-text">
            <b>{profile.name}</b>
            <span>{profile.email}</span>
          </div>
        </div>

        <dl className="profile-details">
          {hasMobilePhone ? (
            <div>
              <dt>Mobile</dt>
              <dd>{savedMobilePhone}</dd>
            </div>
          ) : (
            <p className="profile-required-message">Mobile required for alerts and approvals</p>
          )}
        </dl>

        <div className="profile-phone-form">
          <label htmlFor="profile-mobile-phone">Mobile number</label>
          <div className="profile-phone-row">
            <input
              aria-label="Country code"
              className="country-code-input"
              inputMode="tel"
              onChange={(event) => setCountryCode(event.currentTarget.value)}
              placeholder="+1"
              type="tel"
              value={countryCode}
            />
            <input
              id="profile-mobile-phone"
              inputMode="tel"
              onChange={(event) => setNationalNumber(event.currentTarget.value)}
              placeholder="Mobile number"
              type="tel"
              value={nationalNumber}
            />
            <button type="button" onClick={() => void saveMobilePhone()}>
              Save
            </button>
          </div>
          {status ? <p>{status}</p> : null}
        </div>

        <div className="profile-preferences">
          <p>Preferences</p>
          <ul>
            {profile.preferences.map((preference) => (
              <li key={preference}>{preference}</li>
            ))}
          </ul>
        </div>

        <button className="logout-button" type="button" onClick={() => void signOut({ callbackUrl: "/login" })}>
          Log out of Keystone
        </button>
      </div>
    </details>
  );
}
