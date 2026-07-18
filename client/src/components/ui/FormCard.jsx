const FormCard = ({ title, subtitle, children, footer }) => {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {children}

      {footer && (
        <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
          {footer}
        </div>
      )}
    </div>
  );
};

export default FormCard;
