import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const SearchBar = ({
	value,
	onChange,
	onSubmit,
	onClear,
	label = "Search residents",
	placeholder = "Search residents by name, email, phone, flat, or block",
	submitLabel = "Search",
	clearLabel = "Clear",
	isSearching = false,
}) => {
	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit?.();
	};

	return (
		<form
			className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-3 md:flex-row md:items-end">
				<div className="flex-1">
					<Input
						label={label}
						name="search"
						type="search"
						placeholder={placeholder}
						value={value}
						onChange={(event) => onChange?.(event.target.value)}
					/>
				</div>

				<div className="flex gap-2 md:self-end">
					<Button type="submit" disabled={isSearching}>
						{isSearching ? `${submitLabel}ing...` : submitLabel}
					</Button>
					<Button type="button" variant="outline" onClick={onClear} disabled={!value || isSearching}>
						{clearLabel}
					</Button>
				</div>
			</div>
		</form>
	);
};

export default SearchBar;
