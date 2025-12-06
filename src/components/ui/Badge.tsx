type BadgeTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';

const toneClass: Record<BadgeTone, string> = {
	neutral: 'bg-white/10 text-white/80 ring-white/15',
	success: 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/30',
	info: 'bg-sky-500/15 text-sky-200 ring-sky-400/30',
	warning: 'bg-amber-500/15 text-amber-200 ring-amber-400/30',
	danger: 'bg-rose-500/15 text-rose-200 ring-rose-400/30'
};

type BadgeProps = {
	children: React.ReactNode;
	tone?: BadgeTone;
	className?: string;
	title?: string;
};

const Badge = ({
	children,
	tone = 'neutral',
	className = '',
	title
}: BadgeProps) => (
	<span
		title={title}
		className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClass[tone]} ${className}`}
	>
		<span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
		{children}
	</span>
);

export default Badge;
