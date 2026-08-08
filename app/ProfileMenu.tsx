"use client";

import { signOut } from "next-auth/react";

type ProfileMenuProps = {
  profile: {
    name: string;
    email: string;
    phone: string;
    roles: string[];
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

export function ProfileMenu({ profile }: ProfileMenuProps) {
  const initials = initialsFor(profile.name, profile.email) || "HC";

  return (
    <details className="profile-menu">
      <summary aria-label="Open profile menu">
        <span className="profile-avatar" aria-hidden="true">{initials}</span>
        <span className="profile-chevron" aria-hidden="true" />
      </summary>

      <div className="profile-popover">
        <div className="profile-heading">
          <span className="profile-avatar large" aria-hidden="true">{initials}</span>
          <div>
            <b>{profile.name}</b>
            <span>{profile.email}</span>
          </div>
        </div>

        <dl className="profile-details">
          <div>
            <dt>Phone</dt>
            <dd>{profile.phone}</dd>
          </div>
          <div>
            <dt>Access</dt>
            <dd>{profile.roles.join(", ").replaceAll("_", " ")}</dd>
          </div>
        </dl>

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
