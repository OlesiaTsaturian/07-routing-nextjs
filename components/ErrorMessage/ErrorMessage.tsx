import css from './ErrorMessage.module.css';

interface Props {
  message?: string;
}

export default function ErrorMessage({ message }: Props) {
  return (
    <p className={css.text}>
      There was an error, please try again... {message}
    </p>
  );
}
