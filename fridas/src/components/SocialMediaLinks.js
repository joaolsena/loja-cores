import React from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const SocialMediaLinks = () => {
  return (
    <div className="social-media-links">
      <a
        href="https://wa.me/5596981401027"
        target="_blank"
        rel="noopener noreferrer external"
        className="social-icon-w"
      >
        <FaWhatsapp />
      </a>
      <a
        href="https://www.instagram.com/coresdefridas/"
        target="_blank"
        rel="noopener noreferrer external"
        className="social-icon"
      >
        <FaInstagram />
      </a>
    </div>
  );
};

export default SocialMediaLinks;
