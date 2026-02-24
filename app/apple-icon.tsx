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
          color: 'white',
          fontFamily: 'Arial',
          fontWeight: 800,
          fontSize: 64,
        }}
      >
        eC
      </div>
    ),
    { ...size },
  )
}
