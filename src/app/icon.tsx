import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/** Tab favicon: three-bar chart motif (matches app header), light on dark. */
export default function Icon() {
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
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'center',
						gap: 3,
						height: 20,
					}}
				>
					<div
						style={{
							width: 6,
							height: 9,
							background: '#e2e8f0',
							borderRadius: 2,
						}}
					/>
					<div
						style={{
							width: 6,
							height: 14,
							background: '#e2e8f0',
							borderRadius: 2,
						}}
					/>
					<div
						style={{
							width: 6,
							height: 20,
							background: '#e2e8f0',
							borderRadius: 2,
						}}
					/>
				</div>
			</div>
		),
		{ ...size },
	)
}
