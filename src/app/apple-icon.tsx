import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** Apple touch icon: same motif as favicon, larger canvas. */
export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: '#020617',
					borderRadius: 36,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'center',
						gap: 14,
						height: 100,
					}}
				>
					<div
						style={{
							width: 28,
							height: 48,
							background: '#e2e8f0',
							borderRadius: 6,
						}}
					/>
					<div
						style={{
							width: 28,
							height: 72,
							background: '#e2e8f0',
							borderRadius: 6,
						}}
					/>
					<div
						style={{
							width: 28,
							height: 100,
							background: '#e2e8f0',
							borderRadius: 6,
						}}
					/>
				</div>
			</div>
		),
		{ ...size },
	)
}
