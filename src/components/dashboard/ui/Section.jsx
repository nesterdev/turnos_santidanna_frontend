import Title from "./Title";

export default function Section({ title, children }) {
  return (
    <section className="space-y-4">
      {title && <Title>{title}</Title>}
      {children}
    </section>
  );
}
