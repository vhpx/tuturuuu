import { Timeline } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CheckBadgeIcon, PlusIcon } from '@heroicons/react/24/solid';
import { showNotification } from '@mantine/notifications';
import { closeAllModals } from '@mantine/modals';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Status } from '../../status';
import { UserRole } from '../../../../types/primitives/UserRole';

interface Props {
  wsId: string;
  role: Partial<UserRole>;
}

interface Progress {
  created: Status;
}

const UserRoleCreateModal = ({ wsId, role }: Props) => {
  const router = useRouter();

  const [progress, setProgress] = useState<Progress>({
    created: 'idle',
  });

  const hasError = progress.created === 'error';
  const hasSuccess = progress.created === 'success';

  useEffect(() => {
    if (hasSuccess)
      showNotification({
        title: 'Thành công',
        message: 'Đã tạo vai trò',
        color: 'green',
      });
  }, [hasSuccess]);

  const createUserRole = async () => {
    const res = await fetch(`/api/workspaces/${wsId}/users/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(role),
    });

    if (res.ok) {
      setProgress((progress) => ({ ...progress, created: 'success' }));
      const { id } = await res.json();
      return id;
    } else {
      showNotification({
        title: 'Lỗi',
        message: 'Không thể tạo vai trò',
        color: 'red',
      });
      setProgress((progress) => ({ ...progress, created: 'error' }));
      return false;
    }
  };

  const [categoryId, setUserRoleId] = useState<string | null>(null);

  const handleCreate = async () => {
    setProgress((progress) => ({ ...progress, created: 'loading' }));
    const categoryId = await createUserRole();
    if (categoryId) setUserRoleId(categoryId);
  };

  const [started, setStarted] = useState(false);

  return (
    <>
      <Timeline
        active={progress.created === 'success' ? 1 : 0}
        bulletSize={32}
        lineWidth={4}
        color={started ? 'green' : 'gray'}
        className="mt-2"
      >
        <Timeline.Item
          bullet={<PlusIcon className="h-5 w-5" />}
          title="Tạo vai trò"
        >
          {progress.created === 'success' ? (
            <div className="text-green-300">Đã tạo vai trò</div>
          ) : progress.created === 'error' ? (
            <div className="text-red-300">Không thể tạo vai trò</div>
          ) : progress.created === 'loading' ? (
            <div className="text-blue-300">Đang tạo vai trò</div>
          ) : (
            <div className="text-zinc-400/80">Đang chờ tạo vai trò</div>
          )}
        </Timeline.Item>

        <Timeline.Item
          title="Hoàn tất"
          bullet={<CheckBadgeIcon className="h-5 w-5" />}
          lineVariant="dashed"
        >
          {progress.created === 'success' ? (
            <div className="text-green-300">Đã hoàn tất</div>
          ) : hasError ? (
            <div className="text-red-300">Đã huỷ hoàn tất</div>
          ) : (
            <div className="text-zinc-400/80">Đang chờ hoàn tất</div>
          )}
        </Timeline.Item>
      </Timeline>

      <div className="mt-4 flex justify-end gap-2">
        {started || (
          <button
            className="rounded border border-zinc-300/10 bg-zinc-300/10 px-4 py-1 font-semibold text-zinc-300 transition hover:bg-zinc-300/20"
            onClick={() => closeAllModals()}
          >
            Huỷ
          </button>
        )}

        {categoryId && (hasError || hasSuccess) && (
          <Link
            href={`/${wsId}/roles/${categoryId}`}
            onClick={() => closeAllModals()}
            className="rounded border border-blue-300/10 bg-blue-300/10 px-4 py-1 font-semibold text-blue-300 transition hover:bg-blue-300/20"
          >
            Xem vai trò
          </Link>
        )}

        <button
          className={`rounded border px-4 py-1 font-semibold transition ${
            hasError
              ? 'border-red-300/10 bg-red-300/10 text-red-300 hover:bg-red-300/20'
              : hasSuccess
              ? 'border-green-300/10 bg-green-300/10 text-green-300 hover:bg-green-300/20'
              : started
              ? 'cursor-not-allowed border-zinc-300/10 bg-zinc-300/10 text-zinc-300/50'
              : 'border-blue-300/10 bg-blue-300/10 text-blue-300 hover:bg-blue-300/20'
          }`}
          onClick={() => {
            if (hasError) {
              closeAllModals();
              return;
            }

            if (hasSuccess) {
              router.push(`/${wsId}/users/roles`);
              closeAllModals();
              return;
            }

            if (!started) {
              setStarted(true);
              handleCreate();
            }
          }}
        >
          {hasError
            ? 'Quay lại'
            : hasSuccess
            ? 'Hoàn tất'
            : started
            ? 'Đang tạo'
            : 'Bắt đầu'}
        </button>
      </div>
    </>
  );
};

export default UserRoleCreateModal;
