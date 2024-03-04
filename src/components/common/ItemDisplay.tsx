import { ReactNode } from 'react';
import { Typography } from '@/components/common';

interface IItemDisplayProps {
  data: any;
  attrsAndLabels: {
    label: string;
    attr: string;
    display?: (val: any) => ReactNode;
  }[];
}
function ItemDisplay(props: IItemDisplayProps) {
  const { data, attrsAndLabels } = props;

  return (
    <>
      {attrsAndLabels.map((item) => {
        const { display, attr } = item;
        return (
          <div
            key={item.label}
            className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-3"
          >
            <Typography variant="muted" className="leading-none font-medium">
              {item.label}
            </Typography>

            <Typography className="md:col-span-2">
              {display ? display(data[attr]) : data[attr]}
            </Typography>
          </div>
        );
      })}
    </>
  );
}

export default ItemDisplay;
