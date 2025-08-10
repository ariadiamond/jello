import { useId } from 'react';

export default function TextInput(props: { formKey: string; label: string; type: 'url' | 'text'; }) {
  const { formKey, label, type } = props;
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>
        {label}
      </label>
      <br />
      <input id={id} required name={formKey} type={type} />
    </div>
  );
}

