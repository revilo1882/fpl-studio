import type { ChartDataset } from 'chart.js'

export type LineDataset = ChartDataset<'line', number[]> & {
	metaTeamName: string
	metaTeamIndex: number
}

export const BuildLineDatasets = ({
	shownTeams,
	teamNames,
	gameweekAttractivenessMatrix,
	numberOfGameweeks,
	teamAverageByName,
	colorByTeam,
}: {
	shownTeams: string[]
	teamNames: string[]
	gameweekAttractivenessMatrix: number[][]
	numberOfGameweeks: number
	teamAverageByName: Record<string, number>
	colorByTeam: Record<string, string>
}) => {
	const datasets: LineDataset[] = []

	for (let seriesIndex = 0; seriesIndex < shownTeams.length; seriesIndex += 1) {
		const teamName = shownTeams[seriesIndex]
		const teamIndex = teamNames.indexOf(teamName)
		if (teamIndex === -1) continue

		const values = (gameweekAttractivenessMatrix[teamIndex] ?? []).slice(0, numberOfGameweeks)
		const averageFromGrid = teamAverageByName[teamName]
		const localAverage =
			values.length > 0 ? values.reduce((sum, v) => sum + (v ?? 0), 0) / numberOfGameweeks : 0
		const average = averageFromGrid ?? localAverage
		const color = colorByTeam[teamName]

		datasets.push({
			label: `${teamName} • avg ${average.toFixed(2)}`,
			data: values.map((v) => v ?? 0),
			borderColor: color,
			pointBackgroundColor: color,
			pointBorderColor: color,
			borderWidth: 2,
			pointRadius: 3,
			pointHoverRadius: 5,
			tension: 0.25,
			metaTeamName: teamName,
			metaTeamIndex: teamIndex,
		})
	}

	return datasets
}
