import Image from "next/image";

interface Props {
  slug: string;
  className?: string;
  style?: React.CSSProperties;
}

const slugMap: Record<string, string> = {
  holidays: "holidays",
  "end-of-year": "end-of-year",
  judaica: "judaica",
  army: "army",
  birthday: "birthday",
  balloons: "balloons",
  souvenirs: "souvenirs",
  packages: "packages",
};

export default function CategoryIcon({ slug, className = "w-8 h-8", style }: Props) {
  const file = slugMap[slug] || "packages";
  return (
    <Image
      src={`/icons/${file}.svg`}
      alt=""
      width={32}
      height={32}
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}
