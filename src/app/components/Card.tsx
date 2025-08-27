import type { ReactNode } from "react";

type Card_t = {
  card: {
    header: string;
    link: string;
    body?: ReactNode;
  };
};
function Card(props: Card_t) {
  const {
    card: { header, link, body = null },
  } = props;
  return (
    <div className="p-2 border rounded-sm border-sky-600">
      <div
        className={`flex justify-between mb-1 ${body && "border-b border-solid border-black dark:border-white"}`}
      >
        <h4 className="truncate" title={header}>
          {header}
        </h4>
        <a href={link} className="ml-[0.5em]">
          ↗️
        </a>
      </div>
      {body}
    </div>
  );
}

type CardGroup_t = {
  cards: Card_t["card"][];
};
export default function CardGroup(props: CardGroup_t) {
  const { cards } = props;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((cardData) => (
        <Card key={cardData.link} card={cardData} />
      ))}
    </div>
  );
}
