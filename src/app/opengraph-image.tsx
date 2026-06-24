import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MonieTally. The finance app that does not track you.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#04140F',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blue glow, top left */}
        <div
          style={{
            position: 'absolute',
            top: -150,
            left: -150,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(17,166,117,0.30) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Purple glow, bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,184,96,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* App name */}
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #14B881 0%, #5DDDA8 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-4px',
              lineHeight: 1,
            }}
          >
            MonieTally
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 30,
              color: '#9CA3AF',
              letterSpacing: '-0.5px',
            }}
          >
            Your money, finally clear.
          </div>

          {/* Privacy pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '12px',
              background: 'rgba(17,166,117,0.12)',
              border: '1px solid rgba(17,166,117,0.30)',
              borderRadius: '100px',
              padding: '10px 28px',
            }}
          >
            <div style={{ fontSize: 20, color: '#6FE9B6' }}>
              Wherever you bank.
            </div>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            fontSize: 20,
            color: '#374151',
            letterSpacing: '0.5px',
          }}
        >
          monietally.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
