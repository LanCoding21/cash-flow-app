import clsx from 'clsx';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  route: string;
  title: string;
  icon: ReactNode;
}

function SidebarItem(props: Partial<NavItemProps>) {
  const { route, title, icon } = props;
  return (
    <NavLink
      className={({ isActive }) => {
        return clsx(
          'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-primary-50 dark:hover:bg-gray-700 group',
          {
            active: isActive,
          },
          {
            'bg-primary-50': isActive,
          },
        );
      }}
      to={route!}
    >
      {icon}
      <span className="ms-3">{title}</span>
    </NavLink>
  );
}

export default SidebarItem;
