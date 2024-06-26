'use client';

import { WorkspaceRole } from '@/types/db';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { toast } from '@repo/ui/hooks/use-toast';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import * as z from 'zod';
import RoleForm, { RoleFormSchema } from './form';

interface Props {
  data: Partial<WorkspaceRole>;
  trigger?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  submitLabel?: string;
}

export default function RoleEditDialog({
  data,
  trigger,
  open: externalOpen,
  setOpen: setExternalOpen,
  submitLabel,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation('ws-roles');

  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen ?? internalOpen;
  const setOpen = setExternalOpen ?? setInternalOpen;

  const handleSubmit = async (values: z.infer<typeof RoleFormSchema>) => {
    const res = await fetch(
      data.id
        ? `/api/v1/workspaces/${data.ws_id}/roles/${data.id}`
        : `/api/v1/workspaces/${data.ws_id}/roles`,
      {
        method: data.id ? 'PUT' : 'POST',
        body: JSON.stringify(values),
      }
    );

    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: `Failed to ${data.id ? 'edit' : 'create'} role`,
        description: data.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        onOpenAutoFocus={(e) => (data.name ? e.preventDefault() : null)}
      >
        <DialogHeader>
          <DialogTitle>{t('role')}</DialogTitle>
          <DialogDescription>
            {data.id
              ? t('edit_existing_workspace_role')
              : t('add_new_workspace_role')}
          </DialogDescription>
        </DialogHeader>

        <RoleForm
          data={data}
          onSubmit={handleSubmit}
          submitLabel={submitLabel}
        />
      </DialogContent>
    </Dialog>
  );
}
