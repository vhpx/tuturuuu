import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import NotificationPopover from '../_components/notification-popover';
import { UserNav } from '../_components/user-nav';

export const dynamic = 'force-dynamic';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  // const navLinks: NavLink[] = [
  //   {
  //     name: 'Account',
  //     href: '/settings/account',
  //   },
  //   {
  //     name: 'Appearance',
  //     href: '/settings/appearance',
  //     disabled: true,
  //   },
  //   {
  //     name: 'Workspaces',
  //     href: '/settings/workspaces',
  //     disabled: true,
  //   },
  //   {
  //     name: 'Activities',
  //     href: '/settings/activities',
  //     disabled: true,
  //   },
  // ];

  return (
    <>
      <div className="p-4 pb-2 font-semibold md:px-8 lg:px-16 xl:px-32">
        <div className="mb-2 flex items-center justify-between gap-4">
          <Link href="/" className="mb-2 flex items-center gap-2">
            <Image
              src="/media/logos/transparent.png"
              width={320}
              height={320}
              alt="logo"
              className="h-7 w-7"
            />
            <div className="text-2xl text-black hover:text-zinc-700 dark:text-white dark:hover:text-zinc-200">
              Tuturuuu
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <NotificationPopover />
            <UserNav />
          </div>
        </div>

        {/* <div className="flex gap-1 overflow-x-auto">
          <Navigation navLinks={navLinks} />
        </div> */}
      </div>

      <Separator />

      <div className="flex items-center justify-center p-4 md:px-8 lg:px-16 xl:px-32">
        {children}
      </div>
    </>
  );
}