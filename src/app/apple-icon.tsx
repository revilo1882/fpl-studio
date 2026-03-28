import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const SCALE = 180 / 24
/** Stroke thickness 2 in 24×24 viewBox → proportional width at 180px */
const STROKE = 2 * SCALE
/** Gap between 2px-stroke column centres: 4 units in viewBox (Lucide default spacing) */
const GAP = 4 * SCALE
/** Bar heights from y=20 baseline: segments [6,16,10] in viewBox units */
const H_SHORT = 6 * SCALE
const H_TALL = 16 * SCALE
const H_MID = 10 * SCALE

/**
 * Apple touch icon: same geometry as Lucide BarChart2 / app/icon.svg
 * (short · tall · mid columns, round caps, light on dark).
 */
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
						gap: GAP,
						height: H_TALL,
					}}
				>
					<div
						style={{
							width: STROKE,
							height: H_SHORT,
							background: '#f8fafc',
							borderRadius: STROKE / 2,
						}}
					/>
					<div
						style={{
							width: STROKE,
							height: H_TALL,
							background: '#f8fafc',
							borderRadius: STROKE / 2,
						}}
					/>
					<div
						style={{
							width: STROKE,
							height: H_MID,
							background: '#f8fafc',
							borderRadius: STROKE / 2,
						}}
					/>
				</div>
			</div>
		),
		{ ...size },
	)
}
