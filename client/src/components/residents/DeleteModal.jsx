import Button from "@/components/ui/Button";

const DeleteModal = ({
	isOpen,
	entityLabel = "resident",
	entityName,
	title = "Delete resident",
	description,
	confirmLabel = "Delete resident",
	isDeleting = false,
	onCancel,
	onConfirm,
}) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="delete-entity-title"
		>
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
				<h2 id="delete-entity-title" className="text-lg font-semibold text-slate-900">
					{title}
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-slate-600">
					{description || `This will permanently delete ${entityName || `this ${entityLabel}`} from the system.`}
				</p>

				<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button type="button" variant="outline" onClick={onCancel} disabled={isDeleting}>
						Cancel
					</Button>
					<Button type="button" onClick={onConfirm} disabled={isDeleting}>
						{isDeleting ? "Deleting..." : confirmLabel}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
