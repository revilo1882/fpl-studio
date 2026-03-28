import { FDRConfidenceDisplay } from '@/components/FDRConfidenceDisplay'
import { type EnhancedFDRResult } from '@/lib/fdr'

interface TeamStrengthCardProps {
	teamName: string
	teamOverallFDR: EnhancedFDRResult
}

export function TeamStrengthCard({ teamName, teamOverallFDR }: TeamStrengthCardProps) {
	return (
		<div className='overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm'>
			<FDRConfidenceDisplay
				fdrRating={teamOverallFDR.overall}
				confidenceInterval={teamOverallFDR.confidenceInterval.overall}
				confidenceScore={teamOverallFDR.confidenceInterval.confidenceScore}
				title={`${teamName} Overall Strength`}
				subtitle='How hard this team is to play against (FPL strength + form), benchmarked vs a league-average side — higher = tougher opponent'
				showInterpretation={true}
				compact={true}
			/>
		</div>
	)
}
