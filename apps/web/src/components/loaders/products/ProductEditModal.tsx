import { Timeline } from '@mantine/core';
import { Product } from '../../../types/primitives/Product';
import { useState } from 'react';
import { CheckBadgeIcon, PlusIcon } from '@heroicons/react/24/solid';
import { showNotification } from '@mantine/notifications';
import { closeAllModals } from '@mantine/modals';
import { useRouter } from 'next/router';
import { Status } from '../status';
import { mutate } from 'swr';

interface Props {
  wsId: string;

  oldProduct: Product;
  product: Product;
}

interface Progress {
  updateDetails: Status;
}

const ProductEditModal = ({
  wsId,

  oldProduct,
  product,
}: Props) => {
  const router = useRouter();

  const [progress, setProgress] = useState<Progress>({
    updateDetails: 'idle',
  });

  const hasError = progress.updateDetails === 'error';
  const hasSuccess = progress.updateDetails === 'success';

  const updateDetails = async () => {
    // If the product is not changed, skip this step
    if (
      oldProduct.name === product.name &&
      oldProduct.manufacturer === product.manufacturer &&
      oldProduct.description === product.description &&
      oldProduct.usage === product.usage &&
      oldProduct.category_id === product.category_id
    ) {
      setProgress((progress) => ({ ...progress, updateDetails: 'success' }));
      return true;
    }

    const { id, name, manufacturer, description, usage, category_id } = product;

    const res = await fetch(
      `/api/workspaces/${wsId}/inventory/products/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_id,
          name,
          manufacturer,
          description,
          usage,
        }),
      }
    );

    if (res.ok) {
      setProgress((progress) => ({ ...progress, updateDetails: 'success' }));
    } else {
      showNotification({
        title: 'Lỗi',
        message: 'Không thể cập nhật sản phẩm',
        color: 'red',
      });
      setProgress((progress) => ({ ...progress, updateDetails: 'error' }));
      return false;
    }
  };

  const handleEdit = async () => {
    if (!product.id) return;

    setProgress((progress) => ({ ...progress, updateDetails: 'loading' }));
    await updateDetails();

    mutate(`/api/workspaces/${wsId}/inventory/products/${product.id}`);
  };

  const [started, setStarted] = useState(false);

  return (
    <>
      <Timeline
        active={progress.updateDetails === 'success' ? 1 : 0}
        bulletSize={32}
        lineWidth={4}
        color={started ? 'green' : 'gray'}
        className="mt-2"
      >
        <Timeline.Item
          bullet={<PlusIcon className="h-5 w-5" />}
          title="Cập nhật thông tin cơ bản"
        >
          {progress.updateDetails === 'success' ? (
            <div className="text-green-300">Đã cập nhật thông tin cơ bản</div>
          ) : progress.updateDetails === 'error' ? (
            <div className="text-red-300">
              Không thể cập nhật thông tin cơ bản
            </div>
          ) : progress.updateDetails === 'loading' ? (
            <div className="text-blue-300">Đang cập nhật thông tin cơ bản</div>
          ) : (
            <div className="text-zinc-400/80">
              Đang chờ cập nhật thông tin cơ bản
            </div>
          )}
        </Timeline.Item>

        <Timeline.Item
          title="Hoàn tất"
          bullet={<CheckBadgeIcon className="h-5 w-5" />}
          lineVariant="dashed"
        >
          {progress.updateDetails === 'success' ? (
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

        {product.id && hasSuccess && (
          <button
            className="rounded border border-blue-500/10 bg-blue-500/10 px-4 py-1 font-semibold text-blue-600 transition hover:bg-blue-500/20 dark:border-blue-300/10 dark:bg-blue-300/10 dark:text-blue-300 dark:hover:bg-blue-300/20"
            onClick={() => closeAllModals()}
          >
            Xem sản phẩm
          </button>
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
              router.push(`/${wsId}/inventory/products`);
              closeAllModals();
              return;
            }

            if (!started) {
              setStarted(true);
              handleEdit();
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

export default ProductEditModal;
