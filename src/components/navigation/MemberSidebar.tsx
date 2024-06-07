import {
  ROUTE_CATEGORY,
  ROUTE_DASHBOARD,
  ROUTE_TRANSACTION,
} from '@/config/routes';
import clsx from 'clsx';
import { useMemo } from 'react';
import SidebarItem from './SidebarItem';
import { ArchiveIcon, DashboardIcon, RocketIcon } from '@radix-ui/react-icons';

interface MemberSidebarProps {
  open: boolean;
}

function MemberSidebar(props: Partial<MemberSidebarProps>) {
  const { open } = props;

  const routes = useMemo(() => {
    return [
      { title: 'Dashboard', route: ROUTE_DASHBOARD, icon: <DashboardIcon /> },
      { title: 'Category', route: ROUTE_CATEGORY, icon: <ArchiveIcon /> },
      { title: 'Transaction', route: ROUTE_TRANSACTION, icon: <RocketIcon /> },
    ];
  }, []);

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full md:translate-x-0 bg-white border-r border-gray-200',
        [open && 'translate-x-0'],
        [!open && '-translate-x-full'],
      )}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {routes.map((item) => (
            <li key={item.route}>
              <SidebarItem
                title={item.title}
                route={item.route}
                icon={item.icon}
              />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default MemberSidebar;
