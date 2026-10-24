import { useEffect, useState } from "react";
import "./PlayerAvatar.css";

/**
 * PlayerAvatar component - Reusable player image with fallback to initials
 * @param {string} name - Player name
 * @param {string} imageUrl - URL to player image
 * @param {string} size - Size variant: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} className - Additional CSS classes
 */
function PlayerAvatar({ name = "Player", imageUrl = "", size = "medium", className = "" }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  // Get initials from player name
  const getInitials = (playerName) => {
    if (!playerName) return "P";

    const words = playerName.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Show initials fallback if no image or image failed to load
  const showFallback = !imageUrl || imageError;

  return (
    <div className={`player-avatar player-avatar-${size} ${className}`}>
      {showFallback ? (
        <div className="player-avatar-fallback">
          <span>{initials}</span>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={name}
          className="player-avatar-image"
          loading="lazy"
          onError={handleImageError}
        />
      )}
    </div>
  );
}

export default PlayerAvatar;
