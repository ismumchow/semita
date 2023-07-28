import { Item } from "@prisma/client";

interface DeliverableProps {
  items: Item[];
}

const Deliverable = ({ items }: DeliverableProps) => {
  console.log(items);
  return (
    <div className=" border border-gray-200 rounded-lg"> 
    <div className="container p-4 mx-auto sm:px-1 lg:px-2">
      <ul className="space-y-4">
        {items.map((el) => (
          <li key={el.id} className="p-3 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-2xl text-gray-700 font-semibold">{el.name}</h3>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Deliverable;
