const FormAlert = ({ message, errors = [] }) => {
  if (!message && errors.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message && <p className="font-medium">{message}</p>}

      {errors.length > 0 && (
        <ul className={`${message ? "mt-2" : ""} list-inside list-disc space-y-1`}>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormAlert;
