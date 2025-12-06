type ListItemProps = {
	title: React.ReactNode;
	meta?: React.ReactNode;
	right?: React.ReactNode;
	children?: React.ReactNode;
};

const ListItem = ({ title, meta, right, children }: ListItemProps) => (
	<div className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.05]">
		<div className="flex items-start justify-between gap-4">
			<div className="min-w-0">
				<div className="truncate text-sm font-semibold text-white">{title}</div>
				{meta ? <div className="mt-1 text-xs text-white/60">{meta}</div> : null}
			</div>
			{right ? <div className="shrink-0">{right}</div> : null}
		</div>
		{children ? (
			<div className="mt-2 text-sm text-white/75">{children}</div>
		) : null}
	</div>
);

export default ListItem;
