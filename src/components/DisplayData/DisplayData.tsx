import type { FC, ReactNode } from 'react';
import Link from 'next/link';

import './styles.css';

export type DisplayDataRow = {
  title: string;
} & (
  | { type: 'link'; value?: string }
  | { value: ReactNode }
);

export interface DisplayDataProps {
  header?: ReactNode;
  footer?: ReactNode;
  rows: DisplayDataRow[];
}

export const DisplayData: FC<DisplayDataProps> = ({ header, rows, footer }) => (
  <div className="display-data">
    {header && <h3 className="display-data__header">{header}</h3>}
    <div className="display-data__rows">
      {rows.map((item, idx) => {
        let valueNode: ReactNode;

        if (item.value === undefined) {
          valueNode = <i>empty</i>;
        } else {
          if ('type' in item && item.type === 'link' && typeof item.value === 'string') {
            valueNode = (
              <Link href={item.value}>
                <a target="_blank" rel="noopener noreferrer">Open</a>
              </Link>
            );
          } else if (typeof item.value === 'string') {
            // Assuming `RGB` is a custom component you have that checks if color is valid RGB
            valueNode = <span>{item.value}</span>;
          } else if (typeof item.value === 'boolean') {
            valueNode = (
              <input type="checkbox" checked={item.value} readOnly disabled />
            );
          } else {
            valueNode = item.value;
          }
        }

        return (
          <div className="display-data__row" key={idx}>
            <div className="display-data__title">{item.title}</div>
            <div className="display-data__value">{valueNode}</div>
          </div>
        );
      })}
    </div>
    {footer && <div className="display-data__footer">{footer}</div>}
  </div>
);
