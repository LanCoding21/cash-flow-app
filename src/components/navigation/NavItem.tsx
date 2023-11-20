import clsx from 'clsx';
import Typography from '@/components/common/Typography';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  route: string;
  title: string;
  icon: ReactNode;
}

function NavItem(props: Partial<NavItemProps>) {
  const { route, title, icon } = props;
  return (
    <NavLink
      className={({ isActive }) => {
        return clsx('flex w-full nav-item', {
          active: isActive,
        });
      }}
      to={route!}
    >
      <span className="absolute bg-primary inset-y-0 w-1 left-0 rounded-r-lg ribbon" />

      {icon}
      <div className={clsx('flex items-center gap-4 w-full')}>
        <Typography variant="small" className={clsx('ml-2 title font-normal')}>
          {title}
        </Typography>
      </div>
    </NavLink>
  );
}

export default NavItem;
