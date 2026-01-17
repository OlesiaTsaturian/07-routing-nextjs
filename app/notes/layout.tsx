interface Props {
  children: React.ReactNode;
}

export default function NotesLayoutPage({ children }: Props) {
  return <section>{children}</section>;
}
