export default function CityHeroTitle({ title }: { title: string }) {
  const splitMarker = " for ";
  const splitIndex = title.lastIndexOf(splitMarker);

  if (splitIndex === -1) {
    return <h1>{title}</h1>;
  }

  const lead = title.slice(0, splitIndex + splitMarker.length).trimEnd();
  const emphasis = title.slice(splitIndex + splitMarker.length);

  return (
    <h1>
      {lead}
      {" "}
      <span>{emphasis}</span>
    </h1>
  );
}
