export default function Title({ title, description }) {
  return (
    <div className="py-4 px-6 border-b border-base/10">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm opacity-75">{description}</p>}
    </div>
  );
}
