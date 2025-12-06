type CardProps = {
	title?: string;
	subtitle?: string;
	children: React.ReactNode;
	className?: string;
	headerRight?: React.ReactNode;
};

const Card = ({
	title,
	subtitle,
	children,
	className = '',
	headerRight
}: CardProps) => (
	<section
		className={`rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur transition hover:border-white/15 hover:bg-white/[0.07] ${className}`}
	>
		{title ? (
			<div className="mb-4 flex items-start justify-between gap-3">
				<div>
					<h2 className="text-base font-semibold text-white">{title}</h2>
					{subtitle ? (
						<p className="mt-1 text-xs text-white/60">{subtitle}</p>
					) : null}
				</div>
				{headerRight ? <div className="shrink-0">{headerRight}</div> : null}
			</div>
		) : null}

		{children}
	</section>
);

export default Card;
