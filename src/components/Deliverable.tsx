import { Item } from "@prisma/client";

interface DeliverableProps {
  items: Item[];
}

const Deliverable = ({ items }: DeliverableProps) => {
  return (
    <div className="flex flex-col p-6 bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Deliverable Items</h2>
      {items.map((item, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
        >
          <p className="text-gray-700">{item.name}</p>
          <span 
            className={`inline-block px-2 py-1 text-xs font-semibold text-white 
                        rounded-full ${
                          item.status === 'Completed'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Deliverable;
