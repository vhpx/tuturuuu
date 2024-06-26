'use client';

import RoleEditDialog from './edit-dialog';
import { WorkspaceRole } from '@/types/db';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { toast } from '@repo/ui/hooks/use-toast';
import { Row } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface RoleRowActionsProps {
  row: Row<WorkspaceRole>;
}

export function RoleRowActions({ row }: RoleRowActionsProps) {
  const router = useRouter();
  const { t } = useTranslation('ws-roles');

  const role = row.original;

  const deleteRole = async () => {
    const res = await fetch(
      `/api/v1/workspaces/${role.ws_id}/roles/${role.id}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: 'Failed to delete workspace role',
        description: data.message,
      });
    }
  };

  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!role.id || !role.ws_id) return null;

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={deleteRole}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RoleEditDialog
        data={role}
        open={showEditDialog}
        setOpen={setShowEditDialog}
        submitLabel={t('edit_role')}
      />
    </>
  );
}
