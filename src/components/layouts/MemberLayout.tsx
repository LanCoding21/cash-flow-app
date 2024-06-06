import { useEffect, useState } from 'react';
import { HeartIcon } from '@radix-ui/react-icons';
import useAuthStore from '@/store/useAuthStore';
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTE_LOGIN } from '@/config/routes';
import MemberSidebar from '../navigation/MemberSidebar';
import Typography from '../common/Typography';
import Backdrop from '../common/Backdrop';
import NavBar from '../navigation/NavBar';

function MemberLayout() {
  const [open, setOpen] = useState(false);
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) navigate(ROUTE_LOGIN);
  }, [accessToken]);

  useEffect(() => {
    document.querySelector('body')?.classList.add('bg-gray-100');
  }, []);
  return (
    <>
      <div className="bg-gray-100 h-full w-full flex flex-col justify-between">
        <div className="flex w-full h-full" style={{ minHeight: '95vh' }}>
          <NavBar onHamburgerMenuClick={() => setOpen(!open)} />
          <MemberSidebar open={open} />
          <main className="lg:pl-64 w-full pt-12">
            <div className="px-2 md:px-10 py-10 ">
              <Outlet />
            </div>
          </main>
        </div>
        <footer className="lg:pl-72 w-full">
          <div className="flex justify-between px-10">
            <div className="flex items-center">
              <Typography className="opacity-70">Made with</Typography>
              <span className="pl-1">
                <HeartIcon
                  fill="red"
                  height={18}
                  width={18}
                  stroke="red"
                  opacity={0.7}
                />
              </span>
            </div>
            <div>
              <Typography className="opacity-70">by Reza</Typography>
            </div>
          </div>
        </footer>
      </div>
      <Backdrop
        show={open}
        onClick={() => setOpen(!open)}
        className="lg:invisible"
      />
    </>
  );
}

export default MemberLayout;
