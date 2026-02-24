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
          color: 'white',
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontSize: 14,
        }}
      >
        eC
      </div>
    ),
    { ...size },
  )
}
