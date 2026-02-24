import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0A5C4A 0%, #095346 100%)',
          borderRadius: 40,
        }}
      >
        <svg width="110" height="120" viewBox="0 0 110 120" fill="none">
          <path
            d="M55 4L106 22V58C106 86 84 108 55 116C26 108 4 86 4 58V22L55 4Z"
            fill="white"
            fillOpacity="0.2"
            stroke="white"
            strokeWidth="4"
          />
          <text
            x="55"
            y="72"
            textAnchor="middle"
            fill="white"
            fontFamily="Arial"
            fontWeight="800"
            fontSize="42"
          >
            eC
          </text>
        </svg>
      </div>
    ),
    { ...size },
  )
}
