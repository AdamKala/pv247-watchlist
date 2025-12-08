type ScoreBadgeProps = {
	value: number;
};

const ScoreBadge = ({ value }: ScoreBadgeProps) => {
	const v = Math.round(value);
	const tone =
		v >= 85
			? 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/30'
			: v >= 70
				? 'bg-sky-500/15 text-sky-200 ring-sky-400/30'
				: v >= 50
					? 'bg-amber-500/15 text-amber-200 ring-amber-400/30'
					: 'bg-rose-500/15 text-rose-200 ring-rose-400/30';

	return (
		<span
			className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone}`}
			aria-label={`Score ${v}`}
			title={`Score: ${v}`}
		>
			<span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
			{v}/100
		</span>
	);
};

export default ScoreBadge;
