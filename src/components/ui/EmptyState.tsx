type EmptyStateProps = {
	title: string;
	hint?: string;
};

const EmptyState = ({ title, hint }: EmptyStateProps) => (
	<div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 text-center">
		<p className="text-sm font-medium text-white/80">{title}</p>
		{hint ? <p className="mt-1 text-xs text-white/55">{hint}</p> : null}
	</div>
);

export default EmptyState;
