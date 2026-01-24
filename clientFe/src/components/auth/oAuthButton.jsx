import React from "react";

function OAuthButton() {
  return (
    <div>
      <button
        type="button"
        className="w-full border py-2 rounded flex items-center justify-center gap-2"
      >
        <span>🔐</span>
        Continue with Google
      </button>
    </div>
  );
}

export default OAuthButton;
