import css from './SearchBox.module.css';

interface SearchBoxProps {
  searchNote: string;
  onSearch: (query: string) => void;
}

export default function SearchBox({ searchNote, onSearch }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onSearch(event.target.value);
  return (
    <>
      <input
        className={css.input}
        type="text"
        defaultValue={searchNote}
        onChange={handleChange}
        placeholder="Search notes"
      />
    </>
  );
}
