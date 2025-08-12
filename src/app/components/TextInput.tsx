import { useId } from 'react';

export default function TextInput(props: { formKey: string; label: string; type: 'url' | 'text'; }) {
  const { formKey, label, nullable = false, type } = props;
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>
        {label}
      </label>
      <br />
      <input id={id} required={!nullable} name={formKey} type={type} />
    </div>
  );
}

