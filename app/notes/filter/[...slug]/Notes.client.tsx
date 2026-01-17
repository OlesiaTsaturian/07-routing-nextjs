'use client';

import { useState } from 'react';
import css from './NotesPage.module.css';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { Toaster } from 'react-hot-toast';
import { fetchNotes } from '../../../../lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import NoteForm from '@/components/NoteForm/NoteForm';

type NotesClientProps = {
  tag?: string;
};

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [queryDebounce] = useDebounce(search.trim(), 700);
  const [stateModal, setStateModal] = useState(false);
  const normalizedTag = tag === 'all' ? undefined : tag;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, search: queryDebounce, tag: normalizedTag }],
    queryFn: () =>
      fetchNotes({
        page: page,
        perPage: 12,
        search: queryDebounce,
        tag: normalizedTag,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, 500);

  const openModal = () => {
    setStateModal(true);
  };
  const closeModal = () => {
    setStateModal(false);
  };

  return (
    <>
      <div className={css.app}>
        <Toaster />
        <header className={css.toolbar}>
          <SearchBox searchNote={search} onSearch={handleSearch} />

          {isLoading && <Loader />}
          {isError && <ErrorMessage />}

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
          {stateModal && (
            <Modal onClose={closeModal}>
              <NoteForm onClose={closeModal} />
            </Modal>
          )}
        </header>

        {!isError && !isLoading && notes.length > 0 && (
          <NoteList notes={notes} />
        )}
      </div>
    </>
  );
}
