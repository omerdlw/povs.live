export default function Title({ title, description }) {
  return (
    <div className="py-4 px-6 border-b border-black/10 dark:border-white/10">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm opacity-80">{description}</p>}
    </div>
  );
}
