import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import NotificationPopover from '@/app/[lang]/(dashboard)/_components/notification-popover';
import { UserNav } from '@/app/[lang]/(dashboard)/_components/user-nav';
import GetStartedButton from './GetStartedButton';
import { ThemeToggle } from '@/app/[lang]/(dashboard)/_components/theme-toggle';

export const dynamic = 'force-dynamic';

const Navbar = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-foreground/10 bg-background/80 fixed inset-x-0 top-0 z-10 flex items-center justify-between border-b px-4 py-2 font-semibold backdrop-blur-lg md:px-32 lg:px-64">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/media/logos/transparent.png"
          width={320}
          height={320}
          alt="logo"
          className="h-7 w-7"
        />
        <div className="text-xl text-black hover:text-zinc-700 dark:text-white dark:hover:text-zinc-200">
          Tuturuuu
        </div>
      </Link>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <NotificationPopover />
            <UserNav />
          </>
        ) : (
          <>
            <ThemeToggle />
            <GetStartedButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
