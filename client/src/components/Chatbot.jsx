import React, { useEffect } from 'react';

const LiveChat = () => {
  useEffect(() => {
    // Initialize LiveChat configuration
    window.__lc = window.__lc || {};
    window.__lc.license = 18607083;  // Replace this with your LiveChat license number
    window.__lc.integration_name = "manual_onboarding";
    window.__lc.product_name = "livechat";

    // Function to load the LiveChat script
    const loadLiveChat = () => {
      if (!document.getElementById('livechat-script')) {
        const script = document.createElement('script');
        script.async = true;
        script.type = 'text/javascript';
        script.src = 'https://cdn.livechatinc.com/tracking.js';
        script.id = 'livechat-script';  // Give the script an ID so we can track it
        document.head.appendChild(script);
      }
    };

    loadLiveChat();

    // Cleanup function to remove the script if necessary
    return () => {
      const existingScript = document.getElementById('livechat-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <noscript>
      <a href="https://www.livechat.com/chat-with/18607083/" rel="nofollow">Chat with ridan team</a>
      
    </noscript>
  );
};

export default LiveChat;
