export function FieldError({
  error,
  touched,
}: {
  error?: string;
  touched?: boolean;
}) {
  return touched && error ? (
    <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
  ) : null;
}
