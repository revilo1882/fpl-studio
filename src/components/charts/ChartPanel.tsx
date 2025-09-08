'use client'

import React from 'react'

export const ChartPanel: React.FC<{
	header: React.ReactNode
	footer?: React.ReactNode
	children: React.ReactNode
}> = ({ header, footer, children }) => (
	<div className='scoll flex h-full min-h-0 flex-col rounded-lg border border-border bg-background p-3'>
		<div className='mb-3 flex flex-shrink-0 items-center justify-between gap-3'>{header}</div>
		<div className='relative min-h-[280px] flex-1 overflow-auto sm:min-h-[320px] md:min-h-[360px] lg:min-h-[400px]'>
			<div className='h-full w-full min-w-[600px]'>{children}</div>
		</div>
		{footer && (
			<div className='mt-3 flex-shrink-0 rounded-lg bg-muted/30 p-4 text-sm'>{footer}</div>
		)}
	</div>
)
