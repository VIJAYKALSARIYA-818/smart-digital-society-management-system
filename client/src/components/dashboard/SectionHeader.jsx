const SectionHeader = ({ title, description }) => {
  return (
    <div className="mb-4 sm:mb-5">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-500 sm:text-base">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
