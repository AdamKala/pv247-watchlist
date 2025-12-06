'use client';

type SelectProps = {
	id?: string;
	name?: string;
	label?: string;
	value: string;
	onChange: (v: string) => void;
	children: React.ReactNode;
	hint?: string;
};

const Select = ({
	id,
	name,
	label,
	value,
	onChange,
	children,
	hint
}: SelectProps) => (
	<label className="flex flex-col gap-2">
		{label ? (
			<div className="flex items-center justify-between gap-3">
				<span className="text-xs font-medium text-white/70">{label}</span>
				{hint ? (
					<span className="text-[11px] text-white/50">{hint}</span>
				) : null}
			</div>
		) : null}

		<select
			id={id}
			name={name}
			className="w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition outline-none hover:border-white/15 focus:border-white/20 focus:ring-2 focus:ring-white/10 [&>optgroup]:bg-[#0B1020] [&>optgroup]:text-white [&>option]:bg-[#0B1020] [&>option]:text-white"
			value={value}
			onChange={e => onChange(e.target.value)}
		>
			{children}
		</select>
	</label>
);

export default Select;
