type Props = {
  tag: string;
  title: string;
  description: string;
  center?: boolean;
};

export function SectionHeader({ tag, title, description, center }: Props) {
  return (
    <div style={{ textAlign: center ? "center" : "left" }}>
      <span className="section-tag">{tag}</span>
      <h2 className="section-title">{title}</h2>
      <p className="section-desc" style={{ margin: center ? "0 auto" : "0" }}>
        {description}
      </p>
    </div>
  );
}
