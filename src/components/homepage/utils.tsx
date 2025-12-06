export const clamp = (text: string, max: number) =>
	text.length > max ? `${text.slice(0, max)}…` : text;

export const formatCsDateTime = (unixSeconds: number) =>
	new Date(unixSeconds * 1000).toLocaleString('cs-CZ', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
