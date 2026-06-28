'use client';

/**
 * FloatingLogosCss - Pure CSS orbit fallback
 * Used when WebGL unavailable or on low-end devices
 * 12 integration logos orbiting a glowing NEXUS core
 */

const INTEGRATIONS = [
  { icon: '💬', name: 'Slack', color: '#36C5F0' },
  { icon: '🎮', name: 'Discord', color: '#5865F2' },
  { icon: '🎯', name: 'HubSpot', color: '#FF7A59' },
  { icon: '🏢', name: 'Salesforce', color: '#00A1E0' },
  { icon: '📝', name: 'Notion', color: '#000000' },
  { icon: '💳', name: 'Stripe', color: '#635BFF' },
  { icon: '⚡', name: 'Zapier', color: '#FF4F00' },
  { icon: '📧', name: 'Google', color: '#4285F4' },
  { icon: '📱', name: 'Microsoft', color: '#0078D4' },
  { icon: '📋', name: 'Airtable', color: '#18BFFF' },
  { icon: '📨', name: 'Telegram', color: '#0088CC' },
  { icon: '📈', name: 'Pipedrive', color: '#2EBF91' },
];

export function FloatingLogosCss() {
  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Center glowing orb */}
      <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-primary animate-glow" />
      <div className="absolute w-24 h-24 rounded-full blur-2xl bg-primary opacity-30 animate-glow" />
      <div className="absolute text-4xl font-bold text-white z-10">⚡</div>

      {/* Orbiting logos */}
      <div className="relative w-full h-full">
        {INTEGRATIONS.map((integration, i) => {
          const angle = (i / INTEGRATIONS.length) * 360;
          const duration = 20 + (i % 5) * 3;
          const delay = i * 0.5;

          return (
            <div
              key={integration.name}
              className="absolute w-16 h-16 -left-8 -top-8"
              style={{
                left: '50%',
                top: '50%',
                animation: `orbit ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                transformOrigin: '0 0',
              }}
            >
              {/* Glass card */}
              <div
                className="relative w-16 h-16 rounded-2xl glass flex flex-col items-center justify-center group hover:scale-110 transition cursor-pointer"
                style={{
                  borderColor: integration.color,
                  borderWidth: '1px',
                }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition"
                  style={{
                    backgroundColor: integration.color,
                    zIndex: -1,
                  }}
                />

                {/* Logo */}
                <span className="text-2xl">{integration.icon}</span>

                {/* Label on hover */}
                <div className="absolute -bottom-8 text-xs font-semibold text-text-secondary opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {integration.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orbit CSS animation */}
      <style>{`
        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(180px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(180px) rotate(-360deg);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(108, 99, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(108, 99, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.5);
          }
        }
      `}</style>
    </div>
  );
}
