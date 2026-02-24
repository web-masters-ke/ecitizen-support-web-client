import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#095346',
          borderRadius: 8,
        }}
      >
        {/* Shield */}
        <svg
          width="20"
          height="22"
          viewBox="0 0 20 22"
          fill="none"
        >
          <path
            d="M10 1L19 4.5V10.5C19 15.5 15 19.5 10 21C5 19.5 1 15.5 1 10.5V4.5L10 1Z"
            fill="white"
            fillOpacity="0.25"
            stroke="white"
            strokeWidth="1.2"
          />
          <text
            x="10"
            y="14"
            textAnchor="middle"
            fill="white"
            fontFamily="Arial"
            fontWeight="bold"
            fontSize="8"
          >
            eC
          </text>
        </svg>
      </div>
    ),
    { ...size },
  )
}
