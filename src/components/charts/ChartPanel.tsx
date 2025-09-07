'use client'

import React from 'react'

export const ChartPanel: React.FC<{
	header: React.ReactNode
	footer?: React.ReactNode
	children: React.ReactNode
}> = ({ header, footer, children }) => (
	<div className='flex h-full min-h-0 flex-col rounded-lg border border-border bg-background p-3'>
		<div className='mb-3 flex items-center justify-between gap-3'>{header}</div>
		<div className='relative min-h-[360px] flex-1 overflow-hidden'>{children}</div>
		{footer && <div className='mt-3 rounded-lg bg-muted/30 p-4 text-sm'>{footer}</div>}
	</div>
)
