import { FDRConfidenceDisplay } from '@/components/FDRConfidenceDisplay'
import { type EnhancedFDRResult } from '@/lib/fdr'

interface TeamStrengthCardProps {
	teamName: string
	teamOverallFDR: EnhancedFDRResult
}

export function TeamStrengthCard({ teamName, teamOverallFDR }: TeamStrengthCardProps) {
	return (
		<div className='flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm'>
			<div className='min-h-0 flex-1 overflow-y-auto'>
				<FDRConfidenceDisplay
					fdrRating={teamOverallFDR.overall}
					confidenceInterval={teamOverallFDR.confidenceInterval.overall}
					confidenceScore={teamOverallFDR.confidenceInterval.confidenceScore}
					title={`${teamName} Overall Strength`}
					showInterpretation={true}
				/>
			</div>
		</div>
	)
}
