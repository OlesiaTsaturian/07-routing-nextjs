import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteForm.module.css';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { createNote, type CreateParams } from '../../lib/api';

interface NoteFormProps {
  onClose: () => void;
}

const newValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be not longer than 50 characters')
    .required('Title is required')
    .trim(),
  content: Yup.string()
    .max(500, 'Content must be at most 500 characters')
    .trim(),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Please select a tag'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const noteMutation = useMutation({
    mutationFn: (newNote: CreateParams) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
      toast.success('Note added successfully!');
    },
    onError: () => {
      toast.error('Failed to add note');
    },
  });
  const formValues = (
    values: CreateParams,
    actions: FormikHelpers<CreateParams>,
  ) => {
    const valuesTrimmer = {
      tag: values.tag,
      content: values.content.trim(),
      title: values.title.trim(),
    };

    noteMutation.mutate(valuesTrimmer);

    actions.resetForm();
  };

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: '' }}
      onSubmit={formValues}
      validationSchema={newValidationSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
