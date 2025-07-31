'use client'

import React, { useState } from 'react'

import { Info } from 'lucide-react'

interface FDRConfidenceDisplayProps {
	fdrRating: number
	confidenceInterval: [number, number]
	confidenceScore: number
	title?: string
	showInterpretation?: boolean
	compact?: boolean
}

export function FDRConfidenceDisplay({
	fdrRating,
	confidenceInterval,
	confidenceScore,
	title = 'FDR with Confidence Intervals',
	showInterpretation = false,
	compact = false,
}: FDRConfidenceDisplayProps) {
	const [bestCase, worstCase] = confidenceInterval
	const intervalRange = worstCase - bestCase
	const [showTooltip, setShowTooltip] = useState(false)

	const getVolatility = (range: number) => {
		if (range >= 1.0) return 'High'
		if (range >= 0.5) return 'Medium'
		return 'Low'
	}

	const getConfidenceMessage = (score: number, volatility: string) => {
		if (score >= 0.8) return 'High confidence, trust this rating.'
		if (score >= 0.5)
			return `Moderate confidence, watch for changes. Volatility: ${volatility}.`
		return `Low confidence, high uncertainty. Volatility: ${volatility}.`
	}

	const volatility = getVolatility(intervalRange)
	const confidenceMessage = getConfidenceMessage(confidenceScore, volatility)

	// Calculate progress bar value for the current FDR rating
	const progressValue = ((fdrRating - 1) / 4) * 100
	const intervalStart = ((bestCase - 1) / 4) * 100
	const intervalEnd = ((worstCase - 1) / 4) * 100
	const intervalWidth = intervalEnd - intervalStart

	return (
		<div
			className={`rounded-lg bg-card text-card-foreground shadow-sm ${compact ? 'w-full' : 'w-full max-w-md'}`}
		>
			<div className='flex flex-col space-y-1.5 p-6 pb-4'>
				<h3 className='flex items-center gap-2 text-lg font-semibold leading-none tracking-tight'>
					{title}
					{showInterpretation && (
						<div className='relative'>
							<Info
								className='h-4 w-4 cursor-help text-muted-foreground transition-colors hover:text-foreground'
								onMouseEnter={() => setShowTooltip(true)}
								onMouseLeave={() => setShowTooltip(false)}
							/>
							{showTooltip && (
								<div className='absolute -top-2 left-6 z-50 w-64 transform rounded-md border bg-popover p-3 text-sm text-popover-foreground shadow-md'>
									<div className='space-y-3'>
										<div className='space-y-2'>
											<div className='border-b pb-2'>
												<h4 className='text-sm font-semibold'>
													High Confidence (80%+)
												</h4>
												<p className='text-xs text-muted-foreground'>
													Plenty of data, consistent performance. Trust
													this rating.
												</p>
											</div>
											<div className='border-b pb-2'>
												<h4 className='text-sm font-semibold'>
													High Volatility (±0.5+ range)
												</h4>
												<p className='text-xs text-muted-foreground'>
													Rating could swing ±0.5+ points. Risky but
													potential upside.
												</p>
											</div>
											<div>
												<h4 className='text-sm font-semibold'>
													Wide Interval (±1.0+ range)
												</h4>
												<p className='text-xs text-muted-foreground'>
													High uncertainty. Could be great or terrible
													fixture.
												</p>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</h3>
			</div>
			<div className='space-y-4 p-6 pt-0'>
				<div className='flex items-center justify-between'>
					<span className='text-sm font-medium text-muted-foreground'>FDR Rating</span>
					<span className='text-2xl font-bold tabular-nums'>{fdrRating.toFixed(1)}</span>
				</div>

				<div className='relative h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
					{/* Background color segments */}
					<div className='absolute left-0 top-0 h-full w-[25%] rounded-l-full bg-green-500/60' />
					<div className='absolute left-[25%] top-0 h-full w-[25%] bg-green-300/60' />
					<div className='absolute left-[50%] top-0 h-full w-[25%] bg-yellow-400/60' />
					<div className='absolute left-[75%] top-0 h-full w-[25%] rounded-r-full bg-red-500/60' />

					{/* Confidence Interval Overlay */}
					<div
						className='absolute top-0 h-full rounded-full bg-black/20 dark:bg-white/20'
						style={{ left: `${intervalStart}%`, width: `${intervalWidth}%` }}
					/>

					{/* Current FDR Rating Indicator */}
					<div
						className='absolute top-0 h-full w-1 rounded-full bg-black dark:bg-white'
						style={{ left: `${progressValue}%`, transform: 'translateX(-50%)' }}
					/>

					<div className='absolute -bottom-5 left-0 text-xs text-muted-foreground'>
						1.0 (Easy)
					</div>
					<div className='absolute -bottom-5 left-[50%] -translate-x-1/2 text-xs text-muted-foreground'>
						3.0 (Average)
					</div>
					<div className='absolute -bottom-5 right-0 text-xs text-muted-foreground'>
						5.0 (Hard)
					</div>
				</div>

				<div className='mt-4 flex justify-between text-sm text-muted-foreground'>
					<span>Best case: {bestCase.toFixed(1)}</span>
					<span>Worst case: {worstCase.toFixed(1)}</span>
				</div>

				<div className='grid grid-cols-2 gap-4 text-sm'>
					<div className='flex justify-between'>
						<span className='font-medium text-muted-foreground'>Confidence:</span>
						<span className='font-semibold text-foreground'>
							{(confidenceScore * 100).toFixed(0)}%
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='font-medium text-muted-foreground'>Volatility:</span>
						<span className='font-semibold text-foreground'>{volatility}</span>
					</div>
				</div>

				<div className='flex rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20'>
					<Info className='mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400' />
					<p className='text-sm text-blue-800 dark:text-blue-300'>{confidenceMessage}</p>
				</div>
			</div>
		</div>
	)
}
