'use client';

import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';
import Modal from '@/components/Modal/Modal';
import { useRouter } from 'next/navigation';

export default function NotePreview() {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <NoteDetailsClient />
    </Modal>
  );
}
