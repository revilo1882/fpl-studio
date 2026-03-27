export const getTeamBadgeUrl = (teamCode: number, size: 25 | 100 = 25) =>
	`https://resources.premierleague.com/premierleague/badges/${size}/t${teamCode}.png`
